#!/usr/bin/env python3
"""Quick X search for sports betting tweets using xAI API."""

import os
import sys
from datetime import datetime, timedelta

# Add the skills lib to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '.claude', 'skills', 'str-trending-research', 'scripts'))

from lib.xai_x import search_x, parse_x_response
from lib.env import get_config

def main():
    # Get API key
    config = get_config()
    api_key = config.get('XAI_API_KEY')

    if not api_key:
        print("ERROR: XAI_API_KEY not found in .env", file=sys.stderr)
        sys.exit(1)

    # Search params
    model = "grok-4-1-fast-non-reasoning"
    today = datetime.now()
    from_date = (today - timedelta(hours=6)).strftime("%Y-%m-%d")
    to_date = today.strftime("%Y-%m-%d")

    # Search query focused on engagement-heavy sports betting tweets
    today_label = today.strftime('%B %d')
    topic = f"""sports betting tweets with high engagement (1000+ likes or from major accounts).

Include these topics:
- NBA prop bets tonight ({today_label})
- MLB player props today
- Sportsbook promos or line movement
- Betting discipline or bankroll management
- "Lock" picks or parlay posts (good reply targets)
- Injury impact on lines

Prioritize tweets from:
- @PatMcAfeeShow @PardonMyTake @BillSimmons
- @PropBetGuy @EvanAbrams @PFF_Bet
- @DraftKings @FanDuel @BetMGM
- @espn @BleacherReport @TheAthletic
- @ActionNetworkHQ @br_betting

Or any account with 5K+ followers IF the tweet has 1000+ likes.

Focus on tweets with active threads (many replies) posted in last 6 hours."""

    print(f"Searching X for sports betting tweets from {from_date} to {to_date}...", file=sys.stderr)

    response = search_x(api_key, model, topic, from_date, to_date, depth="default")
    items = parse_x_response(response)

    if not items:
        print("No tweets found", file=sys.stderr)
        sys.exit(0)

    # Output results
    for i, item in enumerate(items, 1):
        print(f"\n--- Tweet {i} ---")
        print(f"@{item['author_handle']}")

        if item['engagement']:
            eng = item['engagement']
            likes = eng.get('likes', 'N/A')
            reposts = eng.get('reposts', 'N/A')
            replies = eng.get('replies', 'N/A')
            print(f"Engagement: {likes} likes, {reposts} reposts, {replies} replies")

        print(f"\nTweet:")
        print(item['text'])
        print(f"\n{item['url']}")
        print(f"\nRelevance: {item['relevance']}")
        if item['why_relevant']:
            print(f"Why: {item['why_relevant']}")

    print(f"\n\nFound {len(items)} tweets", file=sys.stderr)

if __name__ == '__main__':
    main()
