"""
test_order.py — Comprehensive unit tests for the Order Service module.

Uses unittest.mock to create mock implementations for InventoryService
and PaymentGateway, allowing us to test all business logic without
real external service dependencies.
"""

import pytest
from unittest.mock import MagicMock, call, patch

from order import (
    Order,
    InventoryService,
    PaymentGateway,
    InventoryShortageError,
    PaymentFailedError,
    InvalidOrderError,
)


# ============================================================
# Fixtures
# ============================================================

@pytest.fixture
def mock_inventory():
    """Create a mock InventoryService with default behavior."""
    inventory = MagicMock(spec=InventoryService)
    inventory.get_stock.return_value = 100  # Default: plenty of stock
    return inventory


@pytest.fixture
def mock_payment():
    """Create a mock PaymentGateway with default behavior."""
    gateway = MagicMock(spec=PaymentGateway)
    gateway.charge.return_value = True  # Default: payment succeeds
    return gateway


@pytest.fixture
def order(mock_inventory, mock_payment):
    """Create a regular (non-VIP) order with mocked services."""
    return Order(
        inventory_service=mock_inventory,
        payment_gateway=mock_payment,
        customer_email="test@example.com",
        is_vip=False,
    )


@pytest.fixture
def vip_order(mock_inventory, mock_payment):
    """Create a VIP order with mocked services."""
    return Order(
        inventory_service=mock_inventory,
        payment_gateway=mock_payment,
        customer_email="vip@example.com",
        is_vip=True,
    )


# ============================================================
# Tests: add_item
# ============================================================

class TestAddItem:
    """Tests for the add_item method."""

    def test_add_single_item(self, order):
        """Adding a single item should create it in the cart."""
        order.add_item("PROD-001", price=29.99, quantity=1)
        assert "PROD-001" in order.items
        assert order.items["PROD-001"]["price"] == 29.99
        assert order.items["PROD-001"]["qty"] == 1

    def test_add_item_default_quantity(self, order):
        """Default quantity should be 1."""
        order.add_item("PROD-001", price=10.00)
        assert order.items["PROD-001"]["qty"] == 1

    def test_add_same_item_increments_quantity(self, order):
        """Adding the same product ID should increment quantity."""
        order.add_item("PROD-001", price=20.00, quantity=2)
        order.add_item("PROD-001", price=20.00, quantity=3)
        assert order.items["PROD-001"]["qty"] == 5

    def test_add_multiple_different_items(self, order):
        """Adding different products should create separate entries."""
        order.add_item("PROD-001", price=10.00)
        order.add_item("PROD-002", price=25.00)
        assert len(order.items) == 2

    def test_add_item_negative_price_raises(self, order):
        """Negative price should raise ValueError."""
        with pytest.raises(ValueError, match="Price cannot be negative"):
            order.add_item("PROD-001", price=-5.00)

    def test_add_item_zero_quantity_raises(self, order):
        """Zero quantity should raise ValueError."""
        with pytest.raises(ValueError, match="Quantity must be greater than zero"):
            order.add_item("PROD-001", price=10.00, quantity=0)

    def test_add_item_negative_quantity_raises(self, order):
        """Negative quantity should raise ValueError."""
        with pytest.raises(ValueError, match="Quantity must be greater than zero"):
            order.add_item("PROD-001", price=10.00, quantity=-3)

    def test_add_item_zero_price_allowed(self, order):
        """Zero price should be allowed (free items)."""
        order.add_item("FREE-001", price=0.00, quantity=1)
        assert order.items["FREE-001"]["price"] == 0.00


# ============================================================
# Tests: remove_item
# ============================================================

class TestRemoveItem:
    """Tests for the remove_item method."""

    def test_remove_existing_item(self, order):
        """Removing an existing item should delete it from cart."""
        order.add_item("PROD-001", price=10.00)
        order.remove_item("PROD-001")
        assert "PROD-001" not in order.items

    def test_remove_nonexistent_item_no_error(self, order):
        """Removing a non-existent item should not raise an error."""
        order.remove_item("NONEXISTENT")  # Should not raise

    def test_remove_one_of_multiple_items(self, order):
        """Removing one item should leave others intact."""
        order.add_item("PROD-001", price=10.00)
        order.add_item("PROD-002", price=20.00)
        order.remove_item("PROD-001")
        assert "PROD-001" not in order.items
        assert "PROD-002" in order.items


# ============================================================
# Tests: total_price
# ============================================================

class TestTotalPrice:
    """Tests for the total_price property."""

    def test_empty_cart_total_is_zero(self, order):
        """Empty cart should have zero total."""
        assert order.total_price == 0

    def test_single_item_total(self, order):
        """Total for one item."""
        order.add_item("PROD-001", price=25.50, quantity=2)
        assert order.total_price == 51.00

    def test_multiple_items_total(self, order):
        """Total for multiple items."""
        order.add_item("PROD-001", price=10.00, quantity=3)  # 30
        order.add_item("PROD-002", price=20.00, quantity=2)  # 40
        assert order.total_price == 70.00


# ============================================================
# Tests: apply_discount
# ============================================================

class TestApplyDiscount:
    """Tests for the apply_discount method."""

    def test_vip_gets_20_percent_off(self, vip_order):
        """VIP customers always get 20% off."""
        vip_order.add_item("PROD-001", price=50.00, quantity=1)
        assert vip_order.apply_discount() == 40.00  # 50 * 0.8

    def test_vip_discount_even_under_100(self, vip_order):
        """VIP discount applies regardless of total."""
        vip_order.add_item("PROD-001", price=30.00, quantity=1)
        assert vip_order.apply_discount() == 24.00  # 30 * 0.8

    def test_regular_over_100_gets_10_percent(self, order):
        """Regulars get 10% off when total exceeds $100."""
        order.add_item("PROD-001", price=60.00, quantity=2)  # 120
        assert order.apply_discount() == 108.00  # 120 * 0.9

    def test_regular_exactly_100_no_discount(self, order):
        """$100 exactly should NOT get the discount (must be > 100)."""
        order.add_item("PROD-001", price=50.00, quantity=2)  # 100
        assert order.apply_discount() == 100.00

    def test_regular_under_100_no_discount(self, order):
        """Regular customers under $100 get no discount."""
        order.add_item("PROD-001", price=30.00, quantity=1)
        assert order.apply_discount() == 30.00

    def test_vip_discount_rounds_correctly(self, vip_order):
        """VIP discount should round to 2 decimal places."""
        vip_order.add_item("PROD-001", price=33.33, quantity=1)
        result = vip_order.apply_discount()
        assert result == 26.66  # 33.33 * 0.8 = 26.664 → rounds to 26.66


# ============================================================
# Tests: checkout
# ============================================================

class TestCheckout:
    """Tests for the checkout method."""

    def test_checkout_successful(self, order, mock_inventory, mock_payment):
        """Happy path: full checkout completes and returns success."""
        order.add_item("PROD-001", price=50.00, quantity=2)  # Total: 100, no discount

        result = order.checkout()

        assert result["status"] == "success"
        assert result["charged_amount"] == 100.00
        assert order.is_paid is True
        assert order.status == "COMPLETED"

        # Verify mocks were called correctly
        mock_inventory.get_stock.assert_called_once_with("PROD-001")
        mock_payment.charge.assert_called_once_with(100.00, "USD")
        mock_inventory.decrement_stock.assert_called_once_with("PROD-001", 2)

    def test_checkout_empty_cart_raises(self, order):
        """Checkout with empty cart should raise InvalidOrderError."""
        with pytest.raises(InvalidOrderError, match="Cannot checkout an empty cart"):
            order.checkout()

    def test_checkout_insufficient_stock_raises(self, order, mock_inventory):
        """Checkout when stock is low should raise InventoryShortageError."""
        mock_inventory.get_stock.return_value = 1  # Only 1 in stock
        order.add_item("PROD-001", price=10.00, quantity=5)  # Trying to buy 5

        with pytest.raises(InventoryShortageError, match="Not enough stock"):
            order.checkout()

        # Payment should NOT have been charged
        order.payment.charge.assert_not_called()

    def test_checkout_payment_declined(self, order, mock_payment):
        """Checkout when payment is declined should raise PaymentFailedError."""
        mock_payment.charge.return_value = False  # Payment declined
        order.add_item("PROD-001", price=10.00, quantity=1)

        with pytest.raises(PaymentFailedError, match="Payment gateway error"):
            order.checkout()

        # Stock should NOT have been decremented
        order.inventory.decrement_stock.assert_not_called()

    def test_checkout_payment_gateway_exception(self, order, mock_payment):
        """Payment gateway network error should raise PaymentFailedError."""
        mock_payment.charge.side_effect = ConnectionError("Network timeout")
        order.add_item("PROD-001", price=10.00, quantity=1)

        with pytest.raises(PaymentFailedError, match="Payment gateway error"):
            order.checkout()

    def test_checkout_vip_discount_applied(self, vip_order, mock_payment):
        """VIP checkout should charge the discounted amount."""
        vip_order.add_item("PROD-001", price=100.00, quantity=1)

        result = vip_order.checkout()

        assert result["charged_amount"] == 80.00  # 20% VIP discount
        mock_payment.charge.assert_called_once_with(80.00, "USD")

    def test_checkout_regular_discount_over_100(self, order, mock_payment):
        """Regular checkout over $100 should get 10% off."""
        order.add_item("PROD-001", price=60.00, quantity=2)  # 120

        result = order.checkout()

        assert result["charged_amount"] == 108.00  # 10% off
        mock_payment.charge.assert_called_once_with(108.00, "USD")

    def test_checkout_multiple_items_stock_checked(self, order, mock_inventory):
        """All items should have their stock checked during checkout."""
        order.add_item("PROD-001", price=10.00, quantity=1)
        order.add_item("PROD-002", price=20.00, quantity=2)

        order.checkout()

        assert mock_inventory.get_stock.call_count == 2
        mock_inventory.get_stock.assert_any_call("PROD-001")
        mock_inventory.get_stock.assert_any_call("PROD-002")

    def test_checkout_multiple_items_stock_decremented(self, order, mock_inventory):
        """All items should have their stock decremented after payment."""
        order.add_item("PROD-001", price=10.00, quantity=1)
        order.add_item("PROD-002", price=20.00, quantity=3)

        order.checkout()

        assert mock_inventory.decrement_stock.call_count == 2
        mock_inventory.decrement_stock.assert_any_call("PROD-001", 1)
        mock_inventory.decrement_stock.assert_any_call("PROD-002", 3)

    def test_checkout_does_not_modify_paid_status_on_failure(self, order, mock_payment):
        """Failed checkout should not modify order state."""
        mock_payment.charge.return_value = False
        order.add_item("PROD-001", price=10.00, quantity=1)

        with pytest.raises(PaymentFailedError):
            order.checkout()

        assert order.is_paid is False
        assert order.status == "DRAFT"


# ============================================================
# Tests: Order Initialization
# ============================================================

class TestOrderInit:
    """Tests for Order initialization."""

    def test_default_state(self, order):
        """New order should be in DRAFT state with no items."""
        assert order.status == "DRAFT"
        assert order.is_paid is False
        assert len(order.items) == 0
        assert order.customer_email == "test@example.com"
        assert order.is_vip is False

    def test_vip_flag(self, vip_order):
        """VIP order should have is_vip=True."""
        assert vip_order.is_vip is True
