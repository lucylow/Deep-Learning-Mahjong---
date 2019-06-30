# Deep Learning Mahjong [麻將]

## Mahjong [机器学习 深度学习 麻將] 
* 3 or 4 player **draw-and-discard game** with 144 tiles based on Chinese characters and symbols.
* Match open pairs of identical tiles, remove from board, exposing the tiles under them for play - until all pairs of tiles have been removed from the board or no more exposed pairs remaining.
* **ML algorithms** allows game to react and respond more ** dynamically ** and in more imaginative ways. Players get more realistic experiences and playable content in a game that involves skill, strategy, calculation, and chance.
* **Deep neural network** with reinforcement learning implemented. Learn from its own game and top human players (via Classic Supervised Learning) where computations are made for every move or position.


## Types [Make Configurable]
* Old Hong Kong/ Cantonese Mahjong
* Competition Mahjong International Standard
* Sichuan Mahjong
* Taisen Mahjong
* Three-Player Mahjong [3-ka]
* Battle Mahjong [Player vs Cartoon NPC]


## Mahjong Tile Count Per Set [Total 144]
* **Simples** [108]
    * Dots 36
    * Bamboo 36
    * Characters 36

* **Honors** [28]
    * Winds - [North West South East] 16
    * Dragons - [Red Green White] 12

* **Bonus** [8]
    * Flower - [Plum Blossom, Orchid, Chrysanthemum, Bamboo] 4
    * Seasons - [Spring, Summer, Autumn, Winter] 4


## Mahjong Combos 
* Heavenly Hand [天糊]
* Great Winds [大四喜]
* Great Dragons [大三元]
* All Kongs [十八羅漢]
* All Honor Tiles[字一色]
* Thirteen Orphans [十三幺]
* Nine Gates Hand [九蓮宝燈]
* Self Triplets [四暗刻]
* All in Triplets [對對糊]
* Mixed one suit [混一色]
* All one suit [清一色]
* Common Hand[平糊]
* Small Dragons [小三元]
* Small Winds [小四喜]


## Mahjong Machine Learning  
* Algorithms playing as NPCs (with adjustable difficulties) which respond to player’s actions in unique, unexpected ways. NPCs are non hard-coded. **Train NPCs by imitating top mahjong players** to learn dynamic movements and actions.
* Computational modelling for complex systems such that game can predict and alter downstream effects:
   * Ex1: Team Dynamics - **Team chemistry score calculated** based on personalities of each gamer. 
   * Ex2: The morale of each player’s abilities as the game is being played in real-time.
* Increased **aesthetics, immersion and realistim**:
   * Ex: Computer Vision algorithms used for **mahjong textures and objects to render dynamically** as player moves tiles on the board.
* NPC-Player Interactions- **Natural language processing** can be used to build realistic interactions in conversations and responses. 
   * Ex: Using Siri, Alexa, or Google Assistant for voice commands 


## Mahjong Deep Learning Algorthm
* **AI will win through intelligence** rather than faster mechanicals speed (Computers can programatically issue commands instantly whereas humans must physically move a mouse or hit the keyboard.) - **Humans avg 300 actions per minute**.
* Deep Neural Network
   * 3 **hidden layers** of 120 neutrons 
   * 3 **dropout layers** to optimize generalization and reduce over-fittingg 
      * Input - State
      * Output - Values related to Mahjong actions
   * last layer uses **softmax function** to return probabilities 
* Reinforcement Learning
   * **Markov decision** process to make decisions involving a chain of if-then statements 
   * **Positive or negative reward**. Algorithm will learn what actions will maximize the reward and which to be avoided.
* Deep Q-Learning
   * Q-table matrix
   * Updates the **Q-table based on the prediction of future mahjong states**.
   * Q-values updated according to the **Bellman equation**.
   * Knowledge based hierarchy foundation [goals, strategies, tactics, chains] where each objective inspects the current game state and decides which lower level objective will be best to achieve it. 
   

## Mahjong Search Gaming Optomization Algorithm
* **Alpha-Beta Prunning **
   * AI weeds out bad moves.
* **“Lookahead” search algorithms **
* Open World Games 
   * Typically require thousands of hours of developer and artist time to render .
   * Become more efficient using **ML path-finding algorithms**.
   * Have the potential to be unlimited in size.


## Database
* Optimize game data with databases.
* **Pre-computed moves** for the beginning/end phrases of the game.
* Types of databases
   * Opening DB
   * Endgame DB 


## Tools
* React Native [JS Framework]
   * Bootstrap React Native app on any OS with no build config- https://github.com/react-community/create-react-native-app
   * iOS Moble
   * Android Mobile
* Flask [Python]
   * Flask Framework
   * Flask-SocketIO
* Keras on top of Tensorflow


## References - Books
* Rules of Mah-Jongg - Joseph Park Babcock
* Maajh: The American Version of the Ancient Chinese Game - Viola L. Cecil
* The Complete Book of Mah-jongg - Alan D. Millington
