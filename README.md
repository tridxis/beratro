# The 365-Day GitHub Streak Challenge with Beratro

New Year, New Me! 🎉

This year, I’m challenge myself again. The mission is simple: ship code every single day. No excuses, no breaks. Just pure builder vibes.

What’s the alpha? I’m cooking up **BERATRO** an NFT Game inspired by Balatro, one of my all-time favorites. I’m a total game-aholic, so what better way to flex my dev skills than building one infused with the chaotic energy of Berachain?

Not just about streaks. It’s about pushing limits, leveling up, and creating something so addictive even I can’t stop playing it 🚀

So, here’s to a year of grinding, shipping, and staying giga-brain. Let’s make it legendary. Builders gonna build 🛠️ 🐻‍❄️

## Vibes

Crazy things need crazy guys. Drop your wildest ideas in a PR, and I’ll cook them right into this game.

## Zero-To-One Diary

I’ll write down every experience I go through, from ideas to execution. Inspired by fellow builders, I hope these logs create a domino effect, sparking something in you.

# Okay Let's Start

## Day 1

Keeping the gameplay of Balatro would be easy, but I’m going to tweak it a bit—making it more defi and chaotic.

Ideas today:

1. I will change game's signature from Joker to the Bera Bera. Guess where I’m getting the art for these bears? I’ll **snap** any bear I come across and turn it into lore and functionality for the game. 🐻📸

**Some Examples I snapshot from my child's books**:

| Bera | Ability | 
|---|---|
| ![Frame 3](https://github.com/user-attachments/assets/d3ca6ecf-e7bc-40c6-92b6-6d3401805865)  |  Saw its mouth and thought it looked like diamond. This one’s definitely +4 Mult for the Diamond suit 💎🐻 |
|![Frame 4](https://github.com/user-attachments/assets/634b88cd-3bc0-4650-9bb7-4668e2049012) | This shy little kid is gonna give you x1.5 Mult for every face-down card in your hand. Cooool!!!  | 

Notice the star on the card? Balatro doesn’t have this, huh? What’s it for? Stay tuned for the reveal! 🌟🃏

## Day 2

Okay, some changes from Balatro

### Joker -> Bera
Information | Beratro | Balatro | 
|---|---|---|
| Unique Card Per Game | 10 | Up to 150 |
| Cards Per Game | 16 x 10 | Up to 150 |
| Combinable \* | Yes | No |
| How to get? | Mint or Random \*\* | Unlock | 

(\*) The Bera card will start with 1-Star (When bought). Can combine 2 Cards 1-Star to 2-Star, and 2 Cards 2-Star to 3-Star to power up card effect

(\*\*) Use ETH to mint Bera Card. It will start with very-small amount (mainly used to cover random-generation fees from ChainLink). And increasing every epoch like Bitcoin-halving (The mechanism will be decide later)

(\*\*\*) You can start easily without a Bera Card or few Bera Cards (but it may feel like a local game). The system will automatically randomize the missing cards for you to make a total of 10 cards to start the game, but this will come with a penalty on rewards.

Cards | Penalty |
|---|---|
| 1 | -90% |
| 2 | -80% |
| 3 | -70% |
| 4 | -50% |
| 5 | -20% |
| 5+ | None |

### Tarots -> Memes 

Mostly keep the functional, but change the feeling 🌝

### Planets -> Flowers 🌹 🌸 🌻

You can't buy them now, even mega-rich! When finished Ante 8, you will be able to mint a random flower. It will permanently increase Chips & Mult of a Hand. Non-tradable (Soulbound Token)

### Spectrals -> Emoji Stickers 🧩 🏵️ 🎟️

Place a sticker on selected card to add an effect to it (x1.5 Mult when the card is in hand, on play, burn all cards in hand, on play, etc...)

Okay, will come back tomorrow! Have a nice day 🍀

## Day 3

After consider, I think 10 Beras 1 game is too boring. So I will increase to 20 Beras / game. In addition, there is a bonus of x1.5 points for users with 10 Bera Cards and x2 points for users with 20 Bera Cards.

Today I finished some basic logics:

- Store game state to zustand, and init games with hand cards (8) and deck cards
- Handle basic score calculation by hand and cards
- Make up the project with constants

I’m thinking about a mechanism where every hand has its own strength. Perhaps the Bera Cards needs to be redesigned to be more balanced.

Okay, will come back tomorrow! Have a nice day 🍀

## Day 4

I think the mechanics of Bera cards will be similar to heroes in MOBA games, with core cards and support cards (possibly even economy cards). So I’ll probably build in this direction. For example, a very imba Bera card could remove a random Bera card when activated, which would require a support Bera card that shields the card on its right / left.

In addition, Bera Cards can be equipped with weapons to  +Chips, +Mult, or xMult. These weapons will appear randomly in the shop when a blind ends.

Today, I finished the logic for playing and discarding cards. Tomorrow, after adding calculations and hanle some states, I’ll be able to play my game. Hooray!

See yaa 🍀

## Day 5

Yes yes, today I finished the score calculation and display them to the screen with a little animation.

I know that I'm too far from the best graphic & fx of Balatro, but save the best for last, I will implement them at the end. And will spend almost time to do it, for sure 📌

Tomorrow, I will test around the score calculation, fix some bugs if having and continue to make a game state. And re-arrange the UIs too. Currently it's too mess.

Tomorrow! See yaa 🍀

## Day 6

Rearranging the layout took more time than I expected.

Today, I also reworked the card design, added responsiveness, and created an animation for scoring.

I couldn't start working on the game state today.

See you all tomorrow! 🍀

## Day 7

Today I add some state to the game. The flow is:

- Check all the Beras using in this game
- Playing
- Round ended -> Checkout
- Shopping -> Next Round
- ...

Tomorrow I will spend more time for the UI. Currently files is too mess & too long. In the beginning, I planned to write plain CSS, but I might need to use a library to speed up the styling process. I’m thinking of using @emotion

See yaa tmr 🍀

## Day 8

I moved all styles to another file and used @emotion for styling. Code is better right now.

And thank God, I found the repo: https://github.com/EFHIII/balatro-calculator, the code is very clean.

I will learn how to breakdown the score from this guy, and tmr will try to simulate a real score calculation including Beras, cards' effect...

I'm thinking about game look & feel to. Maybe it will look like Animal restaurant, cute minimalism & street background (top down)

![image](https://github.com/user-attachments/assets/d887761d-72f3-4a0c-8028-7a2f295c6022)

![image](https://github.com/user-attachments/assets/41d38346-a10f-4b90-8625-d05bf3f7d174)

tmr tmr 🍀

## Day 9

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/74b3ebff-7353-4d7e-95bd-740dd4326b62" />

I like this style!

Spent all day to pick the color scheme then make up game components. Now it looks good (for me)

I want to do more and more on look and feel but I think I need to comeback to game mechanism 🕹️

See tmr 🍀

## Day 10

Today I finished the calculation including beras & in hand cards with mocks. And make a breakdown about scoring, using for animations

Tmr I will make the breakdown animations & decide the first 20 bera cards

It's important day, see you 🍀

## Day 11

Today I made the breakdown animations for total chips, mult & played hand.

About Beras, The first 15 Bera Cards will be like Balatro (diff from name, image & stats), and the last 5 will be different (Except King cards, I like it so muuuuch)

| No |	Bera |	Effect |	Cost |	Rarity |	Type |	Action |
|---|---|---|---|---|---|---|
| 16 | Perfection |	Each played 10 gives +100/+150/+200 Chips when scored if only 10 played |	$8 |	Rare | PLUS_CHIPS | ON_SCORED |
| 17 | Musketeers | x3/x4/x5 Mult if played hand contains a Three of a Kind of J | $8 |	Rare | MULT_MULT | INDEP |
| 18 | Mother Care | 1 in 3/2/1 chance for each played Q to create a Flower card when scored |	$8 | Rare | GEN_FLOWER | ON_SCORED |
| 19 | Crown | Each King held in hand gives x1.5/x2/x2.5 Mult |	$8 | Rare | MULT_MULT | INDEP |
| 20 | AirDrop | Gains x1/x1.5/x2 Mult for every A that is destroyed |	$8 |	Rare | MULT_MULT | INDEP |

Tomorrow I will make data for 20 Beras, then implement them to current game

See ya 🍀

## Day 12

Indeed, naming is an art. Cost a lot of time. But I think from their names, I can easily "invent" the stats for them.

Also, I created the base type, action, and rarity for easier data organization.

Made stats for 18 / 40 cards. Tmr I will do the rest.

Seeey 🍀

## Day 13

Fewww, finished stats for the first 40 cards. I think I need to play around 100 games to re-balance.

Tomorrow I will complete a full game flow without boss effects and shop to see how it is

See youu! 🍀

## Day 14

Randomize 20 Beras from 40, then create 8 clones for each Bera & shuffle. Show game Beras in the first screen

Support Beras in shop & work on buy Bera mechanism

***Serious Mode***

Just kidding :P seeey 🍀

## Day 15

Re-struct function using for both scoring & check condtion (flush, straight, pair...)

Modify Beras data to easily checking bonus when scoring

Tmr I will re-write calculator with real Bera effect & real Bera data

Byee 🍀

## Day 16

Refactor bera stats to adapt dynamic scoring

Fix calculator to using state for calculation

OMG, I need to handle generating flower, meme, sticker... programatically

Sorry for late report, I have some personal stuffs. See you 🍀

## Day 17

Yes yes, I finished implementing all methods to trigger effect of a Beras

Tmr I will apply them in scoring and generating cards

Will cost a lot of time to verify that all Bera cards' effect are right. See soon 🍀








