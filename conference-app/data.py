# data.py - Dummy data for the Google Cloud Tech Conference

CONFERENCE_INFO = {
    "name": "Google Cloud Summit 2026",
    "tagline": "Building the Future with Google Cloud",
    "date": "April 15, 2026",
    "location": "Googleplex, Mountain View, CA",
    "venue": "Main Auditorium & Breakout Rooms",
    "description": (
        "Join us for a full day of cutting-edge talks on Google Cloud Technologies. "
        "From AI & Machine Learning to Cloud Infrastructure, learn from industry experts "
        "and discover what's next in cloud computing."
    ),
}

SPEAKERS = [
    {
        "id": "sp01",
        "first_name": "Maria",
        "last_name": "Chen",
        "linkedin": "https://www.linkedin.com/in/mariachen",
    },
    {
        "id": "sp02",
        "first_name": "James",
        "last_name": "Rodriguez",
        "linkedin": "https://www.linkedin.com/in/jamesrodriguez",
    },
    {
        "id": "sp03",
        "first_name": "Aisha",
        "last_name": "Patel",
        "linkedin": "https://www.linkedin.com/in/aishapatel",
    },
    {
        "id": "sp04",
        "first_name": "David",
        "last_name": "Kim",
        "linkedin": "https://www.linkedin.com/in/davidkim",
    },
    {
        "id": "sp05",
        "first_name": "Sophie",
        "last_name": "Müller",
        "linkedin": "https://www.linkedin.com/in/sophiemuller",
    },
    {
        "id": "sp06",
        "first_name": "Carlos",
        "last_name": "Oliveira",
        "linkedin": "https://www.linkedin.com/in/carlosoliveira",
    },
    {
        "id": "sp07",
        "first_name": "Priya",
        "last_name": "Sharma",
        "linkedin": "https://www.linkedin.com/in/priyasharma",
    },
    {
        "id": "sp08",
        "first_name": "Liam",
        "last_name": "O'Brien",
        "linkedin": "https://www.linkedin.com/in/liamobrien",
    },
    {
        "id": "sp09",
        "first_name": "Yuki",
        "last_name": "Tanaka",
        "linkedin": "https://www.linkedin.com/in/yukitanaka",
    },
    {
        "id": "sp10",
        "first_name": "Elena",
        "last_name": "Vasquez",
        "linkedin": "https://www.linkedin.com/in/elenavasquez",
    },
    {
        "id": "sp11",
        "first_name": "Omar",
        "last_name": "Hassan",
        "linkedin": "https://www.linkedin.com/in/omarhassan",
    },
    {
        "id": "sp12",
        "first_name": "Rebecca",
        "last_name": "Nguyen",
        "linkedin": "https://www.linkedin.com/in/rebeccangyuen",
    },
]

TALKS = [
    {
        "id": "T001",
        "title": "Keynote: The Future of AI on Google Cloud",
        "speakers": ["sp01", "sp02"],
        "categories": ["AI & Machine Learning"],
        "description": (
            "Discover how Google Cloud is pushing the boundaries of artificial intelligence "
            "with Gemini, Vertex AI, and next-generation foundation models. Learn about "
            "the latest breakthroughs and what they mean for developers."
        ),
        "time": "09:00 - 09:45",
        "duration_min": 45,
    },
    {
        "id": "T002",
        "title": "Building Intelligent Apps with Gemini API",
        "speakers": ["sp03"],
        "categories": ["AI & Machine Learning"],
        "description": (
            "A hands-on deep dive into the Gemini API. Learn how to integrate multimodal "
            "AI capabilities into your applications, from text generation to image "
            "understanding and code assistance."
        ),
        "time": "09:50 - 10:35",
        "duration_min": 45,
    },
    {
        "id": "T003",
        "title": "Serverless at Scale with Cloud Run & Cloud Functions",
        "speakers": ["sp04", "sp05"],
        "categories": ["Cloud Infrastructure"],
        "description": (
            "Explore how to build and deploy scalable serverless applications using "
            "Cloud Run and Cloud Functions. We'll cover best practices for autoscaling, "
            "cold start optimization, and cost management."
        ),
        "time": "10:40 - 11:25",
        "duration_min": 45,
    },
    {
        "id": "T004",
        "title": "Real-Time Analytics with BigQuery & Looker",
        "speakers": ["sp06"],
        "categories": ["AI & Machine Learning", "Cloud Infrastructure"],
        "description": (
            "Learn how to unlock insights from your data using BigQuery's serverless "
            "architecture and Looker's powerful visualization capabilities. From streaming "
            "ingestion to real-time dashboards."
        ),
        "time": "11:30 - 12:15",
        "duration_min": 45,
    },
    {
        "id": "LUNCH",
        "title": "Lunch Break & Networking",
        "speakers": [],
        "categories": [],
        "description": "Enjoy lunch and connect with fellow attendees and speakers.",
        "time": "12:15 - 13:15",
        "duration_min": 60,
    },
    {
        "id": "T005",
        "title": "Kubernetes Mastery: GKE Autopilot in Production",
        "speakers": ["sp07", "sp08"],
        "categories": ["Cloud Infrastructure"],
        "description": (
            "Deep dive into Google Kubernetes Engine Autopilot mode. Learn how to run "
            "production workloads with minimal operational overhead, including security "
            "best practices and cost optimization strategies."
        ),
        "time": "13:15 - 14:00",
        "duration_min": 45,
    },
    {
        "id": "T006",
        "title": "Building with Firestore: NoSQL for Modern Apps",
        "speakers": ["sp09"],
        "categories": ["Cloud Infrastructure"],
        "description": (
            "Discover the power of Firestore for building responsive, offline-capable "
            "applications. We'll cover data modeling, real-time listeners, security rules, "
            "and scaling strategies for global deployments."
        ),
        "time": "14:05 - 14:50",
        "duration_min": 45,
    },
    {
        "id": "T007",
        "title": "MLOps on Vertex AI: From Prototype to Production",
        "speakers": ["sp10", "sp11"],
        "categories": ["AI & Machine Learning"],
        "description": (
            "Bridge the gap between ML experimentation and production. Learn how to use "
            "Vertex AI Pipelines, Model Registry, and Feature Store to build robust, "
            "reproducible machine learning workflows."
        ),
        "time": "14:55 - 15:40",
        "duration_min": 45,
    },
    {
        "id": "T008",
        "title": "Securing the Cloud: Zero Trust with Google Cloud Security",
        "speakers": ["sp12"],
        "categories": ["Cloud Infrastructure"],
        "description": (
            "Security is everyone's responsibility. Explore Google Cloud's Zero Trust "
            "security model, including BeyondCorp Enterprise, Security Command Center, "
            "and Cloud Armor for comprehensive threat protection."
        ),
        "time": "15:45 - 16:30",
        "duration_min": 45,
    },
]


def get_speaker_by_id(speaker_id: str) -> dict | None:
    """Return a speaker dict by their ID."""
    for speaker in SPEAKERS:
        if speaker["id"] == speaker_id:
            return speaker
    return None


def get_talks_with_speakers() -> list[dict]:
    """Return all talks with speaker objects resolved (instead of IDs)."""
    enriched = []
    for talk in TALKS:
        talk_copy = dict(talk)
        talk_copy["speaker_objects"] = [
            get_speaker_by_id(sid) for sid in talk["speakers"] if get_speaker_by_id(sid)
        ]
        enriched.append(talk_copy)
    return enriched


def search_talks(query: str = "", category: str = "") -> list[dict]:
    """
    Search talks by a text query (matches title, speaker names) and/or category.
    Returns talks with resolved speaker objects.
    """
    results = []
    query_lower = query.lower().strip()
    category_lower = category.lower().strip()

    for talk in get_talks_with_speakers():
        # Skip the lunch break in search results
        if talk["id"] == "LUNCH":
            continue

        # Category filter
        if category_lower:
            talk_categories = [c.lower() for c in talk.get("categories", [])]
            if not any(category_lower in c for c in talk_categories):
                continue

        # Text query filter (title + speaker names)
        if query_lower:
            title_match = query_lower in talk["title"].lower()
            speaker_match = any(
                query_lower in f"{s['first_name']} {s['last_name']}".lower()
                for s in talk["speaker_objects"]
            )
            desc_match = query_lower in talk.get("description", "").lower()
            if not (title_match or speaker_match or desc_match):
                continue

        results.append(talk)
    return results
