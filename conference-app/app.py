# app.py - Flask server for the Google Cloud Tech Conference site

from flask import Flask, render_template, request, jsonify
from data import CONFERENCE_INFO, SPEAKERS, TALKS, get_talks_with_speakers, search_talks

app = Flask(__name__)


@app.route("/")
def index():
    """Render the main conference page."""
    talks = get_talks_with_speakers()
    categories = sorted(
        {cat for talk in TALKS if talk["id"] != "LUNCH" for cat in talk.get("categories", [])}
    )
    return render_template(
        "index.html",
        conference=CONFERENCE_INFO,
        talks=talks,
        speakers=SPEAKERS,
        categories=categories,
    )


@app.route("/api/search")
def api_search():
    """API endpoint for searching talks."""
    query = request.args.get("q", "")
    category = request.args.get("category", "")
    results = search_talks(query=query, category=category)
    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
