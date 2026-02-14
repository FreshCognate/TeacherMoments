import crypto from 'crypto';
import sample from 'lodash/sample.js';
import indefinite from 'indefinite';

const ADJECTIVES = [
  'able', 'active', 'adept', 'agile', 'alert',
  'alive', 'amazed', 'ample', 'apt', 'astute',
  'avid', 'aware', 'bold', 'bonny', 'brave',
  'breezy', 'bright', 'brisk', 'broad', 'calm',
  'candid', 'caring', 'casual', 'charmed', 'cheery',
  'chief', 'civil', 'clean', 'clear', 'clever',
  'close', 'cogent', 'comfy', 'cool', 'cosmic',
  'cozy', 'crisp', 'curious', 'dapper', 'daring',
  'dashing', 'decent', 'deep', 'deft', 'eager',
  'earnest', 'easy', 'elated', 'elegant', 'elite',
  'epic', 'equal', 'even', 'exact', 'exotic',
  'expert', 'fabled', 'fair', 'faithful', 'fancy',
  'fast', 'fearless', 'festive', 'fine', 'firm',
  'fleet', 'fluent', 'flying', 'focal', 'fond',
  'frank', 'free', 'fresh', 'fun', 'gallant',
  'game', 'gentle', 'gifted', 'glad', 'gleeful',
  'global', 'golden', 'good', 'grand', 'grateful',
  'great', 'groovy', 'grown', 'gutsy', 'handy',
  'happy', 'hardy', 'harmonic', 'hearty', 'helpful',
  'heroic', 'honest', 'humble', 'ideal', 'immense',
  'intent', 'inventive', 'jolly', 'jovial', 'joyful',
  'jubilant', 'keen', 'kind', 'kindred', 'kingly',
  'knowing', 'large', 'lavish', 'leading', 'learned',
  'level', 'light', 'liked', 'limber', 'lively',
  'logical', 'loved', 'loyal', 'lucid', 'lucky',
  'luminous', 'magic', 'major', 'mellow',
  'merry', 'mighty', 'mindful', 'mirthful', 'modern',
  'modest', 'moved', 'musical', 'mutual', 'natty',
  'natural', 'neat', 'needed', 'new', 'nice',
  'nimble', 'noble', 'noted', 'novel', 'observant',
  'open', 'optimal', 'organic', 'outgoing', 'patient',
  'peaceful', 'playful', 'pleasant', 'pleased',
  'plucky', 'plush', 'poised', 'polite', 'popular',
  'positive', 'precise', 'prime', 'proactive', 'prompt',
  'proper', 'proud', 'prudent', 'pure', 'quick',
  'quiet', 'radiant', 'rapid', 'rare', 'ready',
  'real', 'refined', 'relaxed', 'reliable', 'resilient',
  'resolute', 'rich', 'robust', 'royal', 'rugged',
  'safe', 'savvy', 'scenic', 'secure', 'serene',
  'settled', 'sharp', 'shining', 'shrewd', 'sincere',
  'skilled', 'sleek', 'slick', 'smart', 'smiling',
  'smooth', 'snappy', 'snug', 'social', 'solid',
  'sound', 'sparky', 'special', 'speedy', 'spirited',
  'splendid', 'sporty', 'spry', 'stable', 'staunch',
  'steady', 'stellar', 'stoic', 'stout', 'strong',
  'sturdy', 'subtle', 'sunny', 'superb', 'supple',
  'sure', 'swift', 'tactful', 'talented', 'tame',
  'tender', 'thankful', 'thorough', 'thrifty', 'thriving',
  'tidy', 'timely', 'tireless', 'top', 'tough',
  'tranquil', 'trim', 'true', 'trusted', 'truthful',
  'tuned', 'unique', 'united', 'upbeat', 'upright',
  'useful', 'valid', 'valiant', 'varied', 'vast',
  'vibrant', 'vigilant', 'vital', 'vivid', 'vocal',
  'warm', 'wealthy', 'welcome', 'whole', 'willing',
  'wily', 'winning', 'wise', 'witty', 'wonderful',
  'worthy', 'young', 'zappy', 'zealous', 'zen',
  'zesty', 'zippy',
  'abundant', 'accurate', 'admired', 'affable', 'allied',
  'amused', 'animated', 'assured', 'balanced', 'beloved',
  'benign', 'blissful', 'blooming', 'bubbly', 'buoyant',
  'capable', 'centered', 'champion', 'charming', 'classic',
  'coherent', 'composed', 'constant', 'content', 'creative',
  'dazzling', 'detailed', 'devoted', 'diligent', 'distinct',
  'diverse', 'driven', 'dynamic', 'effusive', 'elevated',
  'eminent', 'enduring', 'enriched', 'esteemed', 'eventful',
  'exultant', 'fanciful', 'favored', 'flexible', 'focused',
  'friendly', 'frugal', 'generous', 'genuine', 'graceful',
  'gracious', 'grounded', 'harmless', 'informed', 'inspired',
  'intrepid', 'inviting', 'lasting', 'likeable', 'magnetic',
  'majestic', 'measured', 'merciful', 'meteoric', 'notable',
  'polished', 'pristine', 'punctual', 'rational', 'renowned',
  'resonant', 'sporting', 'stalwart', 'stunning', 'tasteful',
  'tropical', 'unbiased', 'uncommon', 'unending', 'untiring',
  'upcoming', 'verified', 'versed', 'vigorous', 'watchful',
  'whimsical',
];

const ANIMALS = [
  'aardvark', 'agouti', 'akita', 'albatross', 'alligator',
  'alpaca', 'angelfish', 'ant', 'anteater', 'antelope',
  'armadillo', 'baboon', 'badger', 'bandicoot',
  'barnacle', 'barracuda', 'bat', 'beagle', 'bear',
  'beaver', 'beetle', 'binturong', 'bird', 'bison',
  'bluejay', 'boar', 'bobcat', 'bonobo', 'buffalo',
  'bulldog', 'bullfrog', 'butterfly', 'caiman', 'camel',
  'capybara', 'caracal', 'caribou', 'cassowary', 'cat',
  'catfish', 'chameleon', 'chamois', 'cheetah', 'chicken',
  'chihuahua', 'chipmunk', 'chinchilla', 'chinook', 'clam',
  'cobra', 'collie', 'condor', 'coral', 'cougar',
  'coyote', 'crab', 'crane', 'crocodile', 'crow',
  'cuttlefish', 'dachshund', 'dalmatian', 'deer', 'dingo',
  'dodo', 'dogfish', 'dolphin', 'donkey', 'dormouse',
  'dotterel', 'dove', 'duck', 'eagle', 'eel',
  'elephant', 'elk', 'emu', 'falcon', 'fennec',
  'ferret', 'finch', 'flamingo', 'flounder', 'fox',
  'frog', 'gazelle', 'gecko', 'gerbil', 'gibbon',
  'giraffe', 'gnu', 'goat', 'goldfinch', 'goldfish',
  'goose', 'gopher', 'gorilla', 'goshawk', 'grouse',
  'gull', 'guppy', 'hamster', 'hare', 'harrier',
  'hawk', 'hedgehog', 'heron', 'herring', 'hippo',
  'hornet', 'horse', 'huemul', 'hyena', 'hyrax',
  'ibis', 'iguana', 'impala', 'indri', 'insect',
  'jackal', 'jaguar', 'jellyfish', 'kangaroo', 'kelpie',
  'kestrel', 'kingfisher', 'kinkajou', 'kiwi', 'koala',
  'ladybird', 'lapwing', 'lark', 'lemming', 'lemur',
  'leopard', 'liger', 'lion', 'lionfish', 'lizard',
  'llama', 'lobster', 'locust', 'loris', 'lynx',
  'lyrebird', 'macaw', 'magpie', 'mallard', 'manatee',
  'mandrill', 'mantis', 'marten', 'mastiff', 'meerkat',
  'mink', 'mole', 'mongoose', 'moorhen',
  'moose', 'moth', 'mouse', 'mule', 'narwhal',
  'newt', 'ocelot', 'octopus', 'okapi', 'opossum',
  'orangutan', 'oryx', 'osprey', 'ostrich', 'otter',
  'owl', 'oyster', 'paca', 'pademelon',
  'panda', 'panther', 'parrot', 'partridge', 'peacock',
  'peafowl', 'pelican', 'penguin', 'pheasant', 'pig',
  'pigeon', 'piranha', 'platypus', 'pointer', 'pony',
  'poodle', 'porcupine', 'porpoise', 'possum', 'puffin',
  'pug', 'puma', 'python', 'quail', 'rabbit',
  'raccoon', 'ragdoll', 'rail', 'ram', 'rat',
  'raven', 'reindeer', 'rhino', 'robin', 'rook',
  'rottweiler', 'salamander', 'salmon', 'sardine', 'scorpion',
  'seahorse', 'seal', 'serval', 'shark', 'sheep',
  'shrew', 'shrimp', 'skunk', 'sloth', 'snail',
  'snake', 'snowshoe', 'sparrow', 'spider', 'sponge',
  'squid', 'squirrel', 'starfish', 'starling', 'stingray',
  'stork', 'swallow', 'swan', 'tang', 'tapir',
  'tarsier', 'termite', 'tetra', 'tiger', 'toad',
  'tortoise', 'toucan', 'trout', 'turkey', 'turtle',
  'urchin', 'viper', 'wallaby', 'walrus', 'warthog',
  'wasp', 'weasel', 'whale', 'whippet', 'wolf',
  'wolverine', 'wombat', 'woodpecker', 'wren', 'yak',
  'zebra', 'zebu', 'zorilla', 'zorse',
  'anchovy', 'anole', 'asp', 'auk', 'avocet',
  'axolotl', 'babirusa', 'basilisk', 'betta', 'bittern',
  'bongo', 'budgie', 'bunting', 'bushbaby',
  'buzzard', 'canary', 'cardinal', 'catbird', 'chaffinch',
  'char', 'chickadee', 'cichlid', 'civet', 'coati',
  'cockatoo', 'coot', 'corgi', 'cormorant', 'cowbird',
  'curlew', 'darter', 'dipper', 'discus',
  'drongo', 'dugong', 'dunlin', 'echidna', 'egret',
  'ermine', 'fawn', 'fisher', 'fossa', 'frigate',
  'gannet', 'gar', 'gaur', 'gemsbok', 'genet',
  'godwit', 'grackle', 'grebe', 'grouper',
  'gryphon', 'guanaco', 'gundi', 'halibut',
  'hoopoe', 'hornbill', 'husky', 'ibex', 'jabiru',
  'jacana', 'jackdaw', 'jaeger', 'jaguarundi', 'jay',
  'junco', 'kakapo', 'kea', 'killdeer',
  'kite', 'kudu', 'lamprey', 'langur',
  'limpet', 'linnet', 'lorikeet', 'mackerel', 'margay',
  'marlin', 'marmot', 'merlin', 'minnow', 'monal',
  'mudskipper', 'mullet', 'myna', 'nuthatch', 'numbat',
  'oarfish', 'oriole', 'ouzel',
  'pangolin', 'parakeet', 'perch', 'petrel', 'pipit',
  'plover', 'pollock', 'quetzal', 'quokka', 'quoll',
  'redstart', 'remora', 'ringtail', 'roach', 'rosella',
  'sable', 'sandpiper', 'saola', 'sapsucker', 'sculpin',
  'shelduck', 'shoebill', 'siskin', 'skate',
  'smelt', 'snipe', 'sole', 'spoonbill', 'stoat',
  'sturgeon', 'sunbird', 'sunfish', 'swift', 'tanager',
  'tenrec', 'tern', 'thrasher', 'thrush', 'titmouse',
  'treefrog', 'trogon', 'tuna', 'turaco', 'vervet',
  'vicuna', 'vireo', 'vole', 'warbler', 'waxwing',
  'weaver', 'whimbrel', 'widgeon', 'willet', 'wrasse',
  'xerus', 'yapok', 'yellowtail',
];

const MAX_ATTEMPTS = 10;
const SUFFIX_THRESHOLD = 5;

const generateUsername = (withSuffix) => {
  const adjective = sample(ADJECTIVES);
  const animal = sample(ANIMALS);
  const article = indefinite(adjective, { articleOnly: true });
  const base = `${article}-${adjective}-${animal}`;

  if (withSuffix) {
    const suffix = crypto.randomInt(10, 100);
    return `${base}-${suffix}`;
  }

  return base;
};

export default async function generateRandomUsername(User) {
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    const withSuffix = attempts >= SUFFIX_THRESHOLD;
    const username = generateUsername(withSuffix);
    const existingUser = await User.findOne({ username });

    if (!existingUser) return username;
    attempts++;
  }

  throw { message: 'Unable to generate a unique username. Please try again.', statusCode: 500 };
}
