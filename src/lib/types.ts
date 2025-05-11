
export interface Group {
  id: string;
  name: string;
  description: string;
  postCount?: number;
  memberCount?: number;
  backgroundImageUrl?: string; // URL for the group card background image
  creatorId?: string; // Firebase UID of the user who created the group
}

export interface Post {
  id: string;
  groupId: string;
  groupName?: string; // Denormalized for easier display
  pseudonym: string; // Always present. Generated if isAnonymous, or can be a fallback.
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  linkUrl?: string;
  linkTitle?: string;
  createdAt: string; // ISO string date
  likes: number;
  dislikes: number;
  commentsCount: number; // Represents the number of top-level comments
  comments?: Comment[]; // Optional: array of comments directly on the post
  isFlagged?: boolean;
  flagReason?: string;
  userId?: string; // Firebase UID of the user who created the post
  userDisplayName?: string; // Optional: Display name of the user. Used if not anonymous.
  userPhotoURL?: string; // Optional: Photo URL of the user. Used if not anonymous.
  isAnonymous?: boolean; // Flag to indicate if the post is made in UnFiltered mode
}

export interface Comment {
  id: string;
  postId: string;
  userId: string; // Firebase UID of the commenter
  userDisplayName: string; // Actual display name of the commenter (for mentions, activity feed)
  userPhotoURL?: string; // Actual photo URL of the commenter
  pseudonym: string; // Always present. Generated if isAnonymous.
  text: string;
  createdAt: string; // ISO string
  likes: number;
  dislikes: number;
  replies?: Comment[]; // Nested replies
  mentions?: string[]; // Array of user IDs mentioned
  isAnonymous?: boolean; // Flag to indicate if the comment is made in UnFiltered mode
}


export const ADJECTIVES = [
  "Agile", "Ancient", "Arctic", "Awesome", "Brave", "Bright", "Bronze", "Calm", "Candid", "Clever", 
  "Cosmic", "Creative", "Curious", "Dapper", "Daring", "Dark", "Digital", "Dreamy", "Eager", 
  "Electric", "Elegant", "Emerald", "Empty", "Epic", "Fair", "Fancy", "Fast", "Fearless", "Fiery",
  "Fluffy", "Focused", "Forest", "Frozen", "Gentle", "Giant", "Glass", "Global", "Golden", "Grand",
  "Green", "Happy", "Hidden", "Honest", "Humble", "Hyper", "Icy", "Ideal", "Iron", "Jade",
  "Jolly", "Joyful", "Keen", "Kind", "Known", "Large", "Laser", "Late", "Lazy", "Light",
  "Liquid", "Lone", "Lost", "Lucky", "Lunar", "Magic", "Majestic", "Major", "Marble", "Mega",
  "Mindful", "Mini", "Modern", "Molten", "Mountain", "Mystic", "Nano", "Nebula", "Noble", "Nova",
  "Ocean", "Omega", "Open", "Orange", "Orbit", "Paper", "Pastel", "Patient", "Perfect", "Phantom",
  "Pixel", "Plain", "Polite", "Power", "Prime", "Proud", "Pure", "Purple", "Quantum", "Quick",
  "Quiet", "Quirky", "Radiant", "Rapid", "Rare", "Regal", "Retro", "River", "Robo", "Royal",
  "Ruby", "Sacred", "Sapphire", "Savage", "Secret", "Shadow", "Sharp", "Silent", "Silly", "Silver",
  "Sincere", "Sky", "Sleek", "Smart", "Smooth", "Solar", "Solid", "Sonic", "Space", "Spark",
  "Special", "Spirit", "Stealth", "Steel", "Stone", "Storm", "Stray", "Strong", "Super", "Swift",
  "Terra", "Titan", "Tranquil", "True", "Turbo", "Twin", "Ultra", "Urban", "Vast", "Velvet",
  "Venom", "Vexed", "Vibrant", "Virtual", "Void", "Voltaic", "Warm", "Water", "Wild", "Windy",
  "Wise", "Witty", "Wonder", "Wooden", "Xeno", "Yellow", "Young", "Zen", "Zero", "Zesty"
] as const;
export type Adjective = typeof ADJECTIVES[number];


export const NOUNS = [
  "Alpaca", "Anchor", "Ant", "Anvil", "Apple", "Arrow", "Asteroid", "Atom", "Aurora", "Automaton",
  "Axe", "Badger", "Balloon", "Banana", "Beacon", "Bear", "Beaver", "Bee", "Bell", "Bicycle",
  "Biscuit", "Blade", "Blizzard", "Blossom", "Boat", "Bolt", "Bomb", "Bonfire", "Book", "Boomerang",
  "Boot", "Bottle", "Boulder", "Bow", "Box", "Brain", "Branch", "Bread", "Brick", "Bridge",
  "Broom", "Bubble", "Bucket", "Bulb", "Bullet", "Bunny", "Bus", "Butterfly", "Button", "Cable",
  "Cactus", "Cake", "Camel", "Camera", "Campfire", "Candle", "Candy", "Canoe", "Canvas", "Car",
  "Caravan", "Carrot", "Cart", "Cascade", "Castle", "Cat", "Cave", "Cauldron", "Celery", "Chain",
  "Chair", "Chalice", "Chameleon", "Charm", "Cheese", "Cherry", "Chess", "Chest", "Chicken", "Chip",
  "Circuit", "City", "Claw", "Clay", "Cliff", "Clock", "Cloud", "Clover", "Coal", "Coast",
  "Cobalt", "Cobra", "Coconut", "Coffee", "Coin", "Comet", "Compass", "Computer", "Cone", "Cookie",
  "Copper", "Coral", "Corn", "Cosmos", "Cotton", "Cow", "Crab", "Crane", "Crater", "Creek",
  "Cricket", "Crocodile", "Crossbow", "Crow", "Crown", "Crystal", "Cube", "Cup", "Curtain", "Cushion",
  "Cyborg", "Cyclone", "Dagger", "Dandelion", "Dart", "Data", "Deer", "Delta", "Demon", "Desert",
  "Desk", "Diamond", "Dice", "Dime", "Dinosaur", "Disc", "Diver", "Dock", "Doctor", "Dog",
  "Dolphin", "Donkey", "Donut", "Door", "Dragon", "Dream", "Drill", "Drink", "Drone", "Droplet",
  "Drum", "Duck", "Dune", "Dungeon", "Dust", "Dynamo", "Eagle", "Earth", "Echo", "Eel",
  "Egg", "Elbow", "Electron", "Elephant", "Elixir", "Elk", "Ember", "Engine", "Enigma", "Entity",
  "Epoch", "Eraser", "Escalator", "Essence", "Evergreen", "Expanse", "Explorer", "Eye", "Fabric", "Factory",
  "Falcon", "Fan", "Fang", "Feather", "Fence", "Fern", "Ferry", "Fiddle", "Field", "Fig",
  "Figure", "File", "Film", "Finger", "Fire", "Firefly", "Fireworks", "Fish", "Fist", "Flag",
  "Flame", "Flask", "Fleet", "Flint", "Float", "Flood", "Floor", "Flour", "Flower", "Flute",
  "Flux", "Fly", "Foam", "Fog", "Font", "Food", "Foot", "Football", "Force", "Forest",
  "Fork", "Formula", "Fortress", "Fossil", "Fountain", "Fox", "Fragment", "Frame", "Freeway", "Fridge",
  "Friend", "Frog", "Frost", "Fruit", "Fuel", "Fungus", "Furnace", "Fuse", "Future", "Gadget",
  "Galaxy", "Game", "Garden", "Garlic", "Gas", "Gate", "Gauntlet", "Gear", "Gecko", "Gem",
  "Generator", "Genesis", "Genie", "Geography", "Geyser", "Ghost", "Giant", "Gift", "Ginger", "Giraffe",
  "Glacier", "Glade", "Glass", "Glaze", "Glider", "Globe", "Gloom", "Glove", "Glow", "Glue",
  "Gnome", "Goat", "Goblin", "Gold", "Golem", "Golf", "Gong", "Goose", "Gopher", "Gorge",
  "Gorilla", "Gown", "Grain", "Grape", "Grass", "Grave", "Gravity", "Grenade", "Griffin", "Grill",
  "Grip", "Grove", "Guard", "Guardian", "Guitar", "Gum", "Gun", "Gyroscope", "Hail", "Hair",
  "Hammer", "Hamster", "Hand", "Handle", "Hangar", "Harbor", "Harp", "Harpoon", "Hat", "Hatchet",
  "Hawk", "Hay", "Hazelnut", "Head", "Heart", "Hedge", "Hedgehog", "Helicopter", "Helmet", "Herb",
  "Hero", "Hexagon", "Highway", "Hill", "Hive", "Hog", "Hole", "Hologram", "Honey", "Hood",
  "Hook", "Hoop", "Hope", "Horn", "Hornet", "Horse", "Hose", "Host", "Hotdog", "Hourglass",
  "House", "Hovercraft", "Hub", "Human", "Hummingbird", "Hurdle", "Hurricane", "Hydra", "Hydrogen", "Hyena",
  "Ice", "Icicle", "Icon", "Idea", "Idol", "Igloo", "Image", "Impala", "Incense", "Index",
  "Inferno", "Infinity", "Ingot", "Ink", "Insect", "Instrument", "Interface", "Invisibility", "Ion", "Iris",
  "Iron", "Island", "Ivory", "Ivy", "Jacket", "Jackal", "Jade", "Jaguar", "Jar", "Jaw",
  "Javelin", "Jelly", "Jellyfish", "Jet", "Jewel", "Jigsaw", "Joker", "Journal", "Joystick", "Judge",
  "Juggernaut", "Juice", "Jukebox", "Jungle", "Kangaroo", "Karate", "Kayak", "Kettle", "Key", "Keyboard",
  "Kiln", "King", "Kiosk", "Kiss", "Kitchen", "Kite", "Kitten", "Kiwi", "Knife", "Knight",
  "Knot", "Koala", "Kraken", "Lab", "Labyrinth", "Ladder", "Ladle", "Ladybug", "Lagoon", "Lake",
  "Lamb", "Lamp", "Lance", "Land", "Lantern", "Laptop", "Lark", "Laser", "Lasso", "Lava",
  "Lawn", "Lead", "Leaf", "Leak", "Leap", "Leather", "Ledger", "Leech", "Leek", "Legacy",
  "Legend", "Legion", "Lemon", "Lemur", "Lens", "Leopard", "Letter", "Lever", "Leviathan", "Library",
  "Lichen", "Life", "Light", "Lightning", "Lily", "Lime", "Limestone", "Line", "Link", "Lion",
  "Lipstick", "Liquid", "List", "Lizard", "Llama", "Loaf", "Lobster", "Lock", "Locket", "Locomotive",
  "Log", "Logic", "Loom", "Loop", "Lotus", "Lotion", "Loudspeaker", "Lounge", "Luck", "Luggage",
  "Lumber", "Lute", "Luxury", "Lychee", "Lynx", "Lyrics", "Macaroni", "Machine", "Magazine", "Mage",
  "Magic", "Magma", "Magnet", "Magnifier", "Mail", "Mammoth", "Mango", "Mansion", "Mantis", "Manual",
  "Map", "Maple", "Marble", "March", "Mare", "Marine", "Mark", "Market", "Marmalade", "Marsh",
  "Marshmallow", "Mask", "Mast", "Master", "Match", "Matrix", "Matter", "Mattress", "Maul", "Maze",
  "Meadow", "Meal", "Measure", "Meat", "Mechanic", "Medal", "Medicine", "Medium", "Melody", "Melon",
  "Member", "Memorial", "Memory", "Menu", "Mercenary", "Mercury", "Meridian", "Mermaid", "Mesh", "Message",
  "Metal", "Meteor", "Meter", "Methane", "Method", "Metro", "Microbe", "Microphone", "Microscope", "Microwave",
  "Milk", "Mill", "Millennium", "Mimic", "Mind", "Mine", "Mineral", "Miniature", "Minion", "Mint",
  "Minute", "Mirage", "Mirror", "Mirth", "Missile", "Mist", "Mitten", "Mixer", "Moat", "Mobile",
  "Model", "Modem", "Module", "Mole", "Molecule", "Molasses", "Monarch", "Money", "Monitor", "Monkey",
  "Monocle", "Monolith", "Monsoon", "Monster", "Monument", "Moon", "Moose", "Moped", "Morning", "Mortar",
  "Mosaic", "Mosquito", "Moss", "Motel", "Motherboard", "Motion", "Motor", "Motorcycle", "Mountain", "Mouse",
  "Moustache", "Mouth", "Movement", "Movie", "Mud", "Muffin", "Mug", "Mulberry", "Mule", "Mummy",
  "Muscle", "Museum", "Mushroom", "Music", "Musket", "Mustard", "Mystery", "Myth", "Nail", "Napkin",
  "Narrative", "Nature", "Nectar", "Needle", "Neighbor", "Neon", "Nest", "Net", "Network", "Neutron",
  "Newspaper", "Nexus", "Night", "Nightmare", "Ninja", "Nitrogen", "Noodle", "North", "Nose", "Notebook",
  "Nothing", "Nova", "Nozzle", "Nuclear", "Nucleus", "Nugget", "Nut", "Nutmeg", "Nylon", "Nymph",
  "Oak", "Oar", "Oasis", "Oatmeal", "Object", "Oblivion", "Observatory", "Obsidian", "Ocean", "Ocelot",
  "Octagon", "Octopus", "Odor", "Office", "Oil", "Olive", "Omega", "Omelette", "Onion", "Onyx",
  "Opera", "Operator", "Opinion", "Opium", "Opossum", "Optic", "Option", "Oracle", "Orange", "Orb",
  "Orbit", "Orchid", "Ore", "Organ", "Origin", "Ornament", "Orphan", "Osprey", "Ostrich", "Otter",
  "Outlet", "Oven", "Overlord", "Owl", "Ox", "Oxygen", "Oyster", "Package", "Paddle", "Page",
  "Pagoda", "Paint", "Palace", "Palm", "Pancake", "Panda", "Panel", "Panther", "Pants", "Paper",
  "Parachute", "Parade", "Paradigm", "Paradox", "Paragon", "Parallel", "Parcel", "Parchment", "Parent", "Park",
  "Parrot", "Parsley", "Part", "Particle", "Partner", "Party", "Passage", "Password", "Pasta", "Pastry",
  "Patch", "Path", "Patio", "Pattern", "Pavement", "Paw", "Pawn", "Pea", "Peace", "Peach",
  "Peacock", "Peak", "Peanut", "Pear", "Pearl", "Peasant", "Pebble", "Pedal", "Pedestal", "Pegasus",
  "Pelican", "Pen", "Pencil", "Pendant", "Pendulum", "Penguin", "Peninsula", "Penny", "Pension", "Pepper",
  "Peppermint", "Perfume", "Pergola", "Perimeter", "Periscope", "Perl", "Person", "Pest", "Pet", "Petal",
  "Petition", "Petroleum", "Pewter", "Phalanx", "Phantom", "Pharaoh", "Pharmacy", "Pheasant", "Phenomenon", "Philosopher",
  "Phoenix", "Phone", "Phonograph", "Phosphorus", "Photo", "Phrase", "Physics", "Piano", "Pickaxe", "Pickle",
  "Picnic", "Picture", "Pie", "Pier", "Pig", "Pigeon", "Pigment", "Pike", "Pilgrim", "Pillar",
  "Pillow", "Pilot", "Pin", "Pincer", "Pine", "Pineapple", "Pioneer", "Pipe", "Pipeline", "Pirate",
  "Piston", "Pit", "Pitcher", "Pixel", "Pizza", "Plague", "Plain", "Plan", "Plane", "Planet",
  "Plank", "Plant", "Plasma", "Plate", "Platform", "Platinum", "Platypus", "Playground", "Pliers", "Plot",
  "Plough", "Plum", "Plumber", "Plume", "Plunger", "Pluto", "Pocket", "Pod", "Poem", "Poet",
  "Point", "Pointer", "Poison", "Poker", "Polaroid", "Pole", "Police", "Policy", "Polish", "Pollen",
  "Polo", "Polygon", "Pomegranate", "Pond", "Pony", "Pool", "Popcorn", "Poppy", "Porcelain", "Porcupine",
  "Portal", "Portrait", "Position", "Post", "Postcard", "Poster", "Pot", "Potato", "Potion", "Pottery",
  "Pouch", "Powder", "Power", "Prairie", "Prayer", "Preacher", "Precipice", "Predator", "Preface", "Prelude",
  "Premium", "Presence", "Present", "President", "Pretzel", "Priest", "Primate", "Prime", "Primer", "Prince",
  "Princess", "Printer", "Priority", "Prison", "Prism", "Prize", "Probe", "Problem", "Process", "Prodigy",
  "Product", "Professor", "Profile", "Program", "Progress", "Project", "Projectile", "Promise", "Propeller", "Property",
  "Prophet", "Prose", "Prospect", "Protector", "Protein", "Protocol", "Proton", "Prototype", "Proverb", "Province",
  "Prune", "Pudding", "Puddle", "Puffin", "Pug", "Pulley", "Pulp", "Puma", "Pump", "Pumpkin",
  "Punch", "Pundit", "Punk", "Pupil", "Puppet", "Puppy", "Purchase", "Purity", "Purple", "Purpose",
  "Purse", "Puzzle", "Pyjamas", "Pyramid", "Python", "Quack", "Quad", "Quadrant", "Quail", "Quake",
  "Quality", "Quarry", "Quarter", "Quartz", "Queen", "Quench", "Quest", "Question", "Quill", "Quilt",
  "Quince", "Quiver", "Quote", "Rabbit", "Raccoon", "Race", "Radar", "Radiator", "Radio", "Radish",
  "Raft", "Rage", "Rail", "Rain", "Rainbow", "Rake", "Ram", "Ramp", "Ranger", "Ransom",
  "Rapier", "Raptor", "Raspberry", "Rat", "Ratchet", "Raven", "Ray", "Razor", "Reactor", "Realm",
  "Reaper", "Reason", "Rebel", "Receipt", "Recipe", "Record", "Recruit", "Rectangle", "Redwood", "Reed",
  "Reef", "Reflection", "Reflex", "Reform", "Refuge", "Regent", "Region", "Reign", "Reindeer", "Relic",
  "Remedy", "Renegade", "Rent", "Report", "Reptile", "Republic", "Rescue", "Reservoir", "Resin", "Resort",
  "Resource", "Rest", "Restaurant", "Result", "Retina", "Retreat", "Return", "Revelation", "Revenge", "Reward",
  "Rhapsody", "Rhetoric", "Rhino", "Rhubarb", "Rhythm", "Ribbon", "Rice", "Riddle", "Ride", "Rider",
  "Ridge", "Rifle", "Right", "Rim", "Ring", "Rink", "Ripple", "Risk", "Ritual", "River",
  "Rivet", "Road", "Roar", "Roast", "Robe", "Robin", "Robot", "Rock", "Rocket", "Rod",
  "Rodeo", "Rogue", "Roll", "Romance", "Roof", "Rook", "Room", "Root", "Rope", "Rose",
  "Rotor", "Round", "Route", "Rover", "Rowboat", "Royal", "Rubber", "Ruby", "Rudder", "Ruin",
  "Rule", "Ruler", "Rumble", "Rune", "Runner", "Rupee", "Rush", "Rust", "Saber", "Sack",
  "Saddle", "Safari", "Safe", "Saga", "Sage", "Sail", "Sailor", "Salad", "Salamander", "Salmon",
  "Salon", "Salt", "Salute", "Samurai", "Sanctuary", "Sand", "Sandal", "Sandwich", "Sapphire", "Sarcasm",
  "Sardine", "Satellite", "Sauce", "Sausage", "Savage", "Savanna", "Saw", "Saxophone", "Scabbard", "Scale",
  "Scallop", "Scalpel", "Scarab", "Scarecrow", "Scarf", "Scene", "Scent", "Scheme", "Scholar", "School",
  "Science", "Scimitar", "Scissors", "Scoop", "Scooter", "Scope", "Scorpion", "Scout", "Scrap", "Scream",
  "Screen", "Screw", "Scribe", "Scroll", "Sculpture", "Scythe", "Sea", "Seagull", "Seal", "Seam",
  "Searchlight", "Seashell", "Season", "Seat", "Seaweed", "Second", "Secret", "Secretary", "Sector", "Sedan",
  "Seed", "Seeker", "Segment", "Seismograph", "Self", "Semaphore", "Senate", "Senior", "Sense", "Sensor",
  "Sentence", "Sentinel", "Sentry", "Sequel", "Sequoia", "Serenade", "Serpent", "Serum", "Servant", "Server",
  "Session", "Setup", "Shack", "Shade", "Shadow", "Shaft", "Shale", "Shaman", "Shame", "Shampoo",
  "Shard", "Shark", "Shawl", "Shears", "Shed", "Sheep", "Sheet", "Shelf", "Shell", "Shelter",
  "Shepherd", "Sheriff", "Shield", "Shift", "Shilling", "Shine", "Shingle", "Ship", "Shipwreck", "Shirt",
  "Shock", "Shoe", "Shop", "Shore", "Shortcut", "Shotgun", "Shoulder", "Shovel", "Shower", "Shrapnel",
  "Shredder", "Shrew", "Shrimp", "Shrine", "Shroud", "Shrub", "Shuttle", "Sickle", "Side", "Siege",
  "Sieve", "Signal", "Signature", "Signet", "Silence", "Silhouette", "Silicon", "Silk", "Silo", "Silver",
  "Simian", "Simplicity", "Simulator", "Sin", "Singer", "Single", "Sink", "Siren", "Sister", "Site",
  "Skeleton", "Sketch", "Ski", "Skill", "Skin", "Skirt", "Skull", "Skunk", "Sky", "Skylight",
  "Skyscraper", "Slab", "Slang", "Slate", "Slave", "Sled", "Sleep", "Sleeve", "Slice", "Slime",
  "Sling", "Slipper", "Slogan", "Slope", "Slot", "Sloth", "Slug", "Slumber", "Smile", "Smoke",
  "Smuggler", "Snail", "Snake", "Snare", "Sneaker", "Snow", "Snowflake", "Soap", "Soccer", "Socket",
  "Soda", "Sofa", "Software", "Soil", "Solar", "Soldier", "Sole", "Solo", "Solution", "Sombrero",
  "Son", "Sonata", "Song", "Soot", "Sorcerer", "Sorrow", "Soul", "Sound", "Soup", "South",
  "Space", "Spaceship", "Spade", "Spaghetti", "Spanner", "Spark", "Sparrow", "Spatula", "Speaker", "Spear",
  "Specialist", "Species", "Spectacle", "Specter", "Spectrum", "Speech", "Speed", "Spell", "Sphere", "Spice",
  "Spider", "Spike", "Spine", "Spiral", "Spirit", "Spitfire", "Spleen", "Splinter", "Spoke", "Sponge",
  "Spool", "Spoon", "Spore", "Sport", "Spotlight", "Spray", "Spring", "Sprinter", "Sprite", "Sprout",
  "Spruce", "Spur", "Spy", "Spyglass", "Squad", "Square", "Squash", "Squid", "Squirrel", "Stability",
  "Stable", "Stack", "Stadium", "Staff", "Stag", "Stage", "Stain", "Stair", "Stake", "Stallion",
  "Stamina", "Stamp", "Stance", "Stand", "Standard", "Star", "Starfish", "Stark", "Start", "State",
  "Statement", "Station", "Statue", "Status", "Steak", "Stealth", "Steam", "Steel", "Stem", "Stencil",
  "Step", "Stereo", "Stern", "Stew", "Stick", "Stigma", "Stiletto", "Still", "Sting", "Stirrup",
  "Stitch", "Stock", "Stocking", "Stomach", "Stone", "Stool", "Stopwatch", "Storage", "Store", "Storm",
  "Story", "Stove", "Strait", "Strand", "Strap", "Strategy", "Straw", "Strawberry", "Stream", "Street",
  "Strength", "Stress", "Stretch", "Strike", "String", "Strip", "Strobe", "Stroke", "Structure", "Struggle",
  "Stub", "Student", "Studio", "Study", "Stump", "Style", "Stylus", "Submarine", "Substance", "Subway",
  "Success", "Succulent", "Sugar", "Suit", "Suitcase", "Sulfur", "Sultan", "Summer", "Summit", "Sun",
  "Sundial", "Sunflower", "Sunlight", "Sunset", "Supernova", "Supper", "Supplement", "Supply", "Support", "Surface",
  "Surfer", "Surgeon", "Surprise", "Survey", "Sushi", "Swallow", "Swamp", "Swan", "Swarm", "Swath",
  "Sweater", "Sweet", "Swift", "Swim", "Swing", "Switch", "Swoop", "Sword", "Sycamore", "Syllable",
  "Symbol", "Symmetry", "Symphony", "Synapse", "Syndicate", "Synergy", "Synod", "Syntax", "Syringe", "Syrup",
  "System", "Tab", "Table", "Tablet", "Tackle", "Taco", "Tactics", "Tadpole", "Tag", "Tail",
  "Tailor", "Tale", "Talisman", "Talk", "Tank", "Tanker", "Tap", "Tape", "Tapestry", "Tar",
  "Target", "Taro", "Tarot", "Tarp", "Tassel", "Taste", "Tattoo", "Tavern", "Taxi", "Tea",
  "Teacher", "Team", "Tear", "Technique", "Technology", "Teddy", "Teenager", "Telepathy", "Telephone", "Telescope",
  "Television", "Temple", "Tempo", "Temptation", "Tenant", "Tendon", "Tennis", "Tent", "Tentacle", "Termite",
  "Terrace", "Terrain", "Terror", "Test", "Testament", "Text", "Textbook", "Textile", "Texture", "Thatch",
  "Theater", "Theft", "Theme", "Theory", "Therapy", "Thermal", "Thesis", "Thicket", "Thief", "Thigh",
  "Thimble", "Thistle", "Thorn", "Thought", "Thread", "Threshold", "Thrill", "Throne", "Thumb", "Thunder",
  "Thyme", "Tiara", "Ticket", "Tide", "Tie", "Tiger", "Tile", "Timber", "Time", "Tinder",
  "Tinfoil", "Tint", "Tip", "Tire", "Tissue", "Titan", "Titanium", "Title", "Toad", "Toast",
  "Tobacco", "Today", "Toe", "Tofu", "Toga", "Toilet", "Token", "Toll", "Tomato", "Tomb",
  "Tomorrow", "Ton", "Tone", "Tongs", "Tongue", "Tonic", "Tool", "Tooth", "Toothbrush", "Topaz",
  "Topic", "Torch", "Tornado", "Torpedo", "Torque", "Torrent", "Tortoise", "Totem", "Touch", "Tour",
  "Tournament", "Towel", "Tower", "Town", "Toxic", "Toy", "Trace", "Track", "Tractor", "Trade",
  "Tradition", "Tragedy", "Trail", "Trailer", "Train", "Trait", "Traitor", "Trance", "Tranquility", "Transfer",
  "Transform", "Transit", "Translate", "Transmission", "Trap", "Trash", "Travel", "Tray", "Treacle", "Treadmill",
  "Treasure", "Treatise", "Treaty", "Tree", "Trek", "Trellis", "Tremor", "Trench", "Trend", "Trial",
  "Triangle", "Tribe", "Tribute", "Trick", "Trident", "Trifle", "Trigger", "Trilogy", "Trinity", "Trinket",
  "Trip", "Tripod", "Triumph", "Trojan", "Troll", "Trombone", "Troop", "Trophy", "Tropic", "Trouble",
  "Trough", "Trousers", "Trout", "Trowel", "Truck", "Truffle", "Trumpet", "Trunk", "Trust", "Truth",
  "Try", "Tsunami", "Tub", "Tube", "Tuba", "Tuber", "Tug", "Tulip", "Tumbleweed", "Tumor",
  "Tuna", "Tundra", "Tune", "Tunic", "Tunnel", "Turbine", "Turbo", "Turf", "Turkey", "Turmoil",
  "Turnip", "Turpentine", "Turquoise", "Turret", "Turtle", "Tusk", "Tutor", "Tuxedo", "Twig", "Twilight",
  "Twine", "Twirl", "Twist", "Tycoon", "Typhoon", "Tyrant", "UFO", "Ukulele", "Ulcer", "Ultimatum",
  "Umbrella", "Umpire", "Uncertainty", "Uncle", "Underground", "Underworld", "Unicorn", "Uniform", "Union", "Universe",
  "University", "Upgrade", "Urchin", "Urine", "Urn", "User", "Utopia", "Vacuum", "Vagabond", "Vale",
  "Valentine", "Valet", "Valhalla", "Validity", "Valley", "Valor", "Value", "Valve", "Vampire", "Van",
  "Vandal", "Vanilla", "Vanity", "Vapor", "Variable", "Variety", "Varnish", "Vase", "Vassal", "Vat",
  "Vault", "Vector", "Vegetable", "Vehicle", "Veil", "Vein", "Velvet", "Vendor", "Veneer", "Venom",
  "Vent", "Venture", "Venue", "Venus", "Veranda", "Verb", "Verdict", "Verse", "Version", "Vertigo",
  "Vessel", "Vest", "Veteran", "Veto", "Vial", "Vibe", "Vibration", "Vicar", "Vice", "Victory",
  "Video", "View", "Viewer", "Vigil", "Viking", "Villa", "Village", "Vine", "Vinegar", "Vintage",
  "Viola", "Violet", "Violin", "Viper", "Virtue", "Virus", "Visa", "Viscount", "Vision", "Visitor",
  "Visor", "Vista", "Vitality", "Vitamin", "Vitreous", "Vivarium", "Vivid", "Vixen", "Vocabulary", "Voice",
  "Void", "Volcano", "Volleyball", "Volt", "Voltage", "Volume", "Vortex", "Vote", "Voucher", "Vow",
  "Vowel", "Voyage", "Voyager", "Vulture", "Wafer", "Waffle", "Wagon", "Waist", "Waiter", "Wake",
  "Walk", "Walker", "Wall", "Wallet", "Wallpaper", "Walnut", "Walrus", "Waltz", "Wand", "Wanderer",
  "War", "Ward", "Warden", "Wardrobe", "Warehouse", "Warlock", "Warmth", "Warning", "Warrant", "Warrior",
  "Wart", "Wash", "Wasp", "Waste", "Watch", "Water", "Waterfall", "Watermelon", "Wave", "Wax",
  "Way", "Wealth", "Weapon", "Weasel", "Weather", "Weaver", "Web", "Wedding", "Wedge", "Weed",
  "Week", "Weight", "Weird", "Well", "Whale", "Wheat", "Wheel", "Whelp", "Whip", "Whirlpool",
  "Whisker", "Whiskey", "Whisper", "Whistle", "White", "Wick", "Widget", "Widow", "Width", "Wife",
  "Wig", "Wilderness", "Willow", "Win", "Wind", "Windmill", "Window", "Wine", "Wing", "Wink",
  "Winner", "Winter", "Wire", "Wisdom", "Wish", "Wisp", "Wit", "Witch", "Wizard", "Wolf",
  "Woman", "Wombat", "Wonder", "Wood", "Wool", "Word", "Work", "Worker", "World", "Worm",
  "Worry", "Worship", "Wound", "Wrath", "Wreath", "Wreck", "Wrench", "Wrestler", "Wrinkle", "Wrist",
  "Writer", "Xylophone", "Yacht", "Yak", "Yam", "Yard", "Yarn", "Year", "Yeast", "Yellow",
  "Yeti", "Yield", "Yodel", "Yoga", "Yogurt", "Yolk", "Youth", "Zebra", "Zenith", "Zephyr",
  "Zero", "Zeus", "Zigzag", "Zinc", "Zinnia", "Zip", "Zombie", "Zone", "Zoo", "Zoom"
] as const;
export type Noun = typeof NOUNS[number];


export interface Message {
  id: string;
  chatSessionId: string;
  senderId: string; // Firebase UID
  senderPseudonym: string; // Dynamic pseudonym for this message in this chat
  text: string;
  createdAt: string; // ISO string
  postIdContext?: string; // Optional: ID of the post this message refers to
}

export interface ChatSession {
  id: string;
  participantIds: string[]; // Array of Firebase UIDs
  // Store pseudonyms per participant for this specific chat session
  participantPseudonyms: { [userId: string]: string }; 
  lastMessageId?: string;
  lastMessageText?: string;
  lastMessageTimestamp?: string; // ISO string
  // unreadCount can be maintained per user within the chat session if needed
  // e.g., unreadCounts: { [userId: string]: number }
}


export type ActivityType =
  | 'USER_CREATED_POST' 
  | 'USER_CREATED_GROUP' 
  | 'USER_POST_FLAGGED' 
  | 'OTHERS_LIKED_USER_POST' 
  | 'OTHERS_COMMENTED_ON_USER_POST'
  | 'USER_MENTIONED_IN_COMMENT'
  | 'POST_NEARING_DELETION' // New activity type for post deletion warning
  | 'MESSAGE_NEARING_DELETION'; // New activity type for message deletion warning

// Specific data interfaces for each activity type
interface BaseActivityData {
  groupId?: string;
  groupName?: string;
  actorUserId?: string; // UID of the actor
  actorDisplayName?: string; // Display name of the actor
  actorPhotoURL?: string;
}

export interface UserCreatedPostData extends BaseActivityData {
  type: 'USER_CREATED_POST';
  postId: string;
  postSnippet: string;
  isAnonymousPost?: boolean; // Added to track if the created post was anonymous
  postPseudonym?: string; // Store the pseudonym if it was an anonymous post
}

export interface UserCreatedGroupData extends BaseActivityData {
  type: 'USER_CREATED_GROUP';
  groupId: string; // Overwrites optional groupId from BaseActivityData
  groupName: string; // Overwrites optional groupName from BaseActivityData
}

export interface UserPostFlaggedData extends BaseActivityData {
  type: 'USER_POST_FLAGGED';
  postId?: string; 
  postSnippet: string;
  flagReason: string;
  isUserAnonymousPost?: boolean; // Was the flagged post by the current user and anonymous?
  postPseudonym?: string;
}

export interface OthersLikedUserPostData extends BaseActivityData {
  type: 'OTHERS_LIKED_USER_POST';
  postId: string;
  postSnippet?: string;
  isUserAnonymousPost?: boolean; // Was the liked post by the current user and anonymous?
  postPseudonym?: string;
}

export interface OthersCommentedOnUserPostData extends BaseActivityData {
  type: 'OTHERS_COMMENTED_ON_USER_POST';
  postId: string;
  postSnippet?: string;
  commentId: string; // ID of the comment
  commentSnippet: string;
  isUserAnonymousPost?: boolean; // Was the commented-on post by the current user and anonymous?
  postPseudonym?: string; 
}

export interface UserMentionedInCommentData extends BaseActivityData {
  type: 'USER_MENTIONED_IN_COMMENT';
  postId: string;
  postSnippet?: string; // Snippet of the post where mention occurred
  commentId: string; // ID of the comment containing the mention
  commentSnippet: string; // Snippet of the comment
  // actorUserId is the one who made the comment and mentioned the user
  // actorDisplayName is the display name of the one who mentioned
}

export interface PostNearingDeletionData extends BaseActivityData {
  type: 'POST_NEARING_DELETION';
  postId: string;
  postSnippet: string;
  deletionDate: string; // ISO string of when the post will be deleted
  groupName: string;
  groupId: string;
}

export interface MessageNearingDeletionData extends BaseActivityData {
  type: 'MESSAGE_NEARING_DELETION';
  messageId: string;
  messageSnippet: string;
  chatSessionId: string;
  otherParticipantDisplayName?: string; // Display name of the other user in the chat
  deletionDate: string; // ISO string of when the message will be deleted
}


// Discriminated union for ActivityItem data
export type ActivityItemData =
  | UserCreatedPostData
  | UserCreatedGroupData
  | UserPostFlaggedData
  | OthersLikedUserPostData
  | OthersCommentedOnUserPostData
  | UserMentionedInCommentData
  | PostNearingDeletionData // Added new type
  | MessageNearingDeletionData; // Added new type

export interface ActivityItem {
  id: string;
  userId: string; // User to whom this activity pertains
  type: ActivityType; 
  timestamp: string; // ISO string
  isRead: boolean;
  data: ActivityItemData;
}

// For email/password authentication forms
export interface EmailPasswordFormValues {
  email: string;
  password: string;
}

export interface SignUpFormValues extends EmailPasswordFormValues {
  confirmPassword: string;
  // displayName?: string; // Optional, if you want to collect it at sign-up
}
