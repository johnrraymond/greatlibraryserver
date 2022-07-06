# Welcome to The Great Library's source code
=======================

This code contains four main parts:

1. the website as a wagtail bakerydemo
2. the code for creating the smart html
3. the code for creating and managing the tokens on the backend
4. the unity code for the game 

=======================

For windows development in Unity use Visual Studio Code. ***COMMUNITY VERSIONS DO NOT WORK!***

Install the solidity extension to compile the contracts.

=======================

This installation walkthrough assumes a ubuntu 20.04. (Works with digital ocean's 20.04LTS droplets.)

Remember the first thing to do is to set up the DNS or you will not be able to created your SSL keys as needed by apache certbot if you want to test your code using apache.

As root admin the droplet by adding john and yourself.  ***john is the effective nobody for the website.***

```
adduser john                                                # Give john a strong password. (never login with him.)
usermod -aG sudo john && gpasswd -a john sudo
adduser yourusernamehere                                    # Use strong password.
gpasswd -a yourusernamehere sudo
usermod -aG john yourusernamehere
chmod g+w /home/john

```

***Log in again if sudo doesn't work.***

## Set up the site user and directories



Add/verify /mnt/* exists and has plenty of space
``` 
df -h
```

# Create a great library server for development

Prep apache and mod_wgsi: 
```
sudo apt update
sudo apt install apache2 apache2-utils ssl-cert libapache2-mod-wsgi-py3 nodejs npm
sudo npm install  ganache-cli --global
sudo a2enmod wsgi
```

Make the bakerydemo from the greatlibraryserver:
```

sudo apt install python3-virtualenv pip
cd ~john
virtualenv wagtailbakerydemo --python=python3

. ../wagtailbakerydemo/bin/activate

sudo apt-get install libtiff5-dev libjpeg8-dev libopenjp2-7-dev zlib1g-dev \
    libfreetype6-dev liblcms2-dev libwebp-dev tcl8.6-dev tk8.6-dev python3-tk \
    libharfbuzz-dev libfribidi-dev libxcb1-dev   # for pillow
 
pip3 install pymysql
pip3 install django_dramatiq
pip3 install redis
pip3 install django_extensions
pip3 install django-ckeditor
pip3 install django-cors-headers
pip3 install simplejson
pip3 install filelock
pip3 install django-richtextfield

pip3 install dj_database_url
pip3 install django_cache_url
pip3 install whitenoise

npm install crypto ## for the secure moralis backend.
```

~~python3 -m pip uninstall python-dotenv~~ # for AttributeError: module 'dotenv' has no attribute 'read_dotenv'

```
sudo apt install git
git clone https://github.com/johnrraymond/greatlibraryserver
cp -r greatlibraryserver bakerydemo
cd bakerydemo
pip3 install -r requirements/base.txt

sudo apt install python3.8-venv
sudo apt-get install pipx
pipx install eth-brownie
pipx ensurepath
source ~/.bashrc

sudo npm install -g moralis-admin-cli
chmod go+w /usr/local/lib/node_modules/moralis-admin-cli/  # Dont do this it is wrong but might fix some error you dont want...

sudo apt install imagemagick   # For autogen of bookmark images...
```

# Copy the env.example.
```
cp env.example .env
```

## Make a new development culture coin administrator account for yourself
```
brownie accounts generate Account1

SUCCESS: A new account '0x183a3e96a8D52E4f4b07688aCfa0fCF50a4CFF02' has been generated with the id 'Account1'
```

***Save the account address and paswword. The account needs to be added to ~john/bakerydemo/.env as the cCA***

# Use the tool in moralis dir. Save the result in the .env as the cCAPrivateKey 
```
(cd ~john/bakerydemo/moralis; node getPrivateKey.js "you mnemonic goes in here as the input")     ## This returns the cCAPrivateKey
```

# Edit the .env file like:
> vi ~john/bakerydemo/.env


## MOCK DEPLOY
```
cd ~john/bakerydemo/brownie
brownie run scripts/deployDummy.py  --network=avax-test
### ValueError: insufficient funds for gas * price + value: 

Fund your new account. Use metamask or some online pay tool.
brownie run scripts/deployDummy.py  --network avax-test
#### DummyContract deployed at: 0xSomewhere
```

## DEPLOY CULTURE COIN, etc
```
brownie run scripts/deployCultureCoinProxyAdmin.py  --network=avax-test     ## add address as proxyAdmin
brownie run scripts/deployCultureCoin.py  --network=avax-test               ## add the contract addrss to the .env as cultureCoinAddressImpl
brownie run scripts/deployCultureCoinProxy.py  --network=avax-test          ## cultureCoinAddress

brownie run scripts/deployMarketPlace.py  --network=avax-test
brownie run scripts/deployPrintingPress.py --network=avax-test

# Deploy the game parts that you can
brownie run scripts/deployBaseSpells.py  --network=avax-test                ## baseSpellsImplAddress
brownie run scripts/deployBaseSpellsProxy.py  --network=avax-test           ## baseSpellsAddress
brownie run scripts/deployBaseLoot.py  --network=avax-test                  ## baseLootImplAddress
brownie run scripts/deployBaseLootProxy.py  --network=avax-test             ## baseLootAddress

## Need the rest of the site deployed for the rest of the game... need a bookmark for the heros, etc
```

## Copy in the database file
```
cd ~john/bakerydemo
sudo cp  ~/bakerydemodb bakerydemodb
```
Expand the library.books.tar.gz into /mnt/media_dir as john:
```
cd /mnt
sudo tar -zxvf ~/library.tar.gz

# This is how you create this tar file:
#/mnt/% tar cvfz library.tar.gz  media_dir/{BOOKV1/,CHAME/,DCBT/,GBCC/,GLBP/,HFMIO/,MBMPGBRRR/,TDAWP/,TDBR/,TLSC/} media_dir/default-bookmark.png
# or if fresh and untainted:

tar cvfz library.tar.gz  media_dir/ media_dir/default-bookmark.png
```

# Setting up the media dir
```
rm /home/john/bakerydemo/bakerydemo/templates/art/datamines
ln -s /mnt/media_dir  /home/john/bakerydemo/bakerydemo/templates/art/datamines
#sudo mkdir /mnt/media_dir

sudo chown john:john /mnt/media_dir

cd ~john/bakerydemo/
python3 ./manage.py collectstatic
python ./manage.py migrate

```

## Deploy a bookmark  using the dev site...
```
cd ~john/bakerydemo

. .env && python3 manage.py runserver 0.0.0.0:9466

```


## Deploy the rest of the game contracts using a bookmark contract for bookmmarkAddress in the .env (e.g. bookmarkAddress="0x9d3f59e810ec2250adcc3aa5947e48d6d927850b"), the DaedalusClassBoosterToken's address and benScratchesAddress
```
brownie run scripts/deployMyItems.py --network=avax-test                ## myItemsAddress
brownie run scripts/deployHero.py --network=avax-test                   ## heroAddress
brownie run scripts/deployTimeCube.py --network=avax-test               ## timeCubeImplAddress
brownie run scripts/deployTimeCubeProxy.py --network=avax-test          ## timeCubeAddress

brownie run scripts/deployTheGoldenKeys.py --network=avax-test          ## theGoldenKeysAddress
brownie run scripts/deployBEN.py --network=avax-test                    ## benDeployAddress
```

## Next the ssl keys
```
sudo apt install certbot python3-certbot-apache
```

Edit the apache config /etc/apache2/sites-available/000-default-le-ssl.conf to look like:
```
<IfModule mod_ssl.c>
<VirtualHost *:443>

        ServerAdmin johnrraymond@yahoo.com
        DocumentRoot /home/john/bakerydemo/

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combine

    Alias /static /home/john/bakerydemo/bakerydemo/collect_static
    <Directory /home/john/bakerydemo/bakerydemo/collect_static/>
        Require all granted
    </Directory>

    <Directory /home/john/bakerydemo/bakerydemo>
        <Files wsgi.py>
            Require all granted
        </Files>
    </Directory>

    WSGIDaemonProcess bakerydemo python-home=/home/john/wagtailbakerydemo python-path=/home/john/bakerydemo/
    WSGIProcessGroup bakerydemo
    WSGIScriptAlias / /home/john/bakerydemo/bakerydemo/wsgi.py

<Directory /home/john/bakerydemo/>
  Require all granted
</Directory>


<Directory /home/john/bakerydemo/>
  Require all granted
</Directory>

</VirtualHost>
</IfModule>
```

Now fight with dns as you try to run:
```
sudo certbot --apache
```

## Edit "/etc/apache2/envvars":
```
export APACHE_RUN_USER=john
export APACHE_RUN_GROUP=john
```

 
```
sudo systemctl restart apache2
```

add admin to wagtail if needed

```
cd ~john/bakerydemo
python3 manage.py migrate

DJANGO_SETTINGS_MODULE=bakerydemo.settings.production python ./manage.py createsuperuser

. .env && python3 manage.py runserver 0.0.0.0:9466#change this # for security reasons
```

# Set up the OfferingsPlaced event listener on moralis.io/servers

From “View Details” for the mainnet server click on “Sync.”

Either add or edit the offerings placed “Sync and Watch Contract Events”
```
Topic:
OfferingPlaced(bytes32, address, address, uint, uint, string)
```

ABI
```
{
  <from files...>
}
'''

Address:
```
<THE CONTRACT DEPLOY ADDRESS>
```
    
Table:
```
PlacedOfferings             # placedOfferings in .env
```

Click confirm.

Save the contracts address, you will need it later in this walk through.

Save the table name in the .env

## BookContracts

Do the same thing again for the BookContracts table and event listener. But this time watch the Printing Press address.
Setting the code for mainnet

```
npm  install --save web3

sudo npm install -g moralis-admin-cli
sudo chown -R <yourusername>:john /usr/local/lib/node_modules/moralis-admin-cli/
 
moralisApiKey="2cEzQ3XynlRGWLR"
moralisApiSecret="SXA9P9laLO8HKr8"
moralisSubdomain="qzzj9cxkd0zd.usemoralis.com"
```

This is the final step: Deploy Cloud :: If you are uncertain about running this command then you probably want to still step up the rest of the site

```
sh bakerydemo/autosavecloud.sh &
% bash deployCloud.sh
```

Browse to the dev site address ... horay! Dev should work.

Then run:
```
sudo systemctl restart apache2
```

The site should be working…
    
https://droplet.greatlibrary.io/admin/login/?next=/admin/  Login with you username and password.

# To run dev site run a command like the following but change the port number:
```
/home/john/bakerydemo$  .   .env && python3 manage.py runserver 0.0.0.0:9466
```

### WARNING DO NOT DO THIS STEP UNLESS YOU NEED TO
```
git clone https://github.com/eth-brownie/brownie.git
cd brownie
sudo python3 setup.py install
```

~~pip3 install django-dotenv~~

# The Great Library’s Requirements

Welcome adventurer, you are not lost if you are a developer interested in Web3/Game-Fi. In keeping with the Great Library’s mission to be open and transparent, here you will find developer documentation and information you need to understand our site and initial game-fi offering: The Scarab Cycle.

Good games have a good game play loop and a good story. The game document is primarily focused on the game play loop. The story comes from the books.

## Getting Started – Time is valuable
Books in the great library have underlying smart contracts–more than one, but the ones we are most interested in for the game are the bookmarks as they are like owning property in Monopoly or even in real-life.

Let’s talk about the game…

The game depends on the bookmarks for profit sharing and as such each hero minted in the game is minted from a bookmark and the owner of the bookmarks take a small cut of the revenues when the items are sold on the in-game auction house.

This is not a free to play game but it is a cheap to play game that interacts with the library’s token: CultureCoin. This coin is not here to confuse players into microtransaction or into a gatcha loop. It is only here to further the Game-FI aspects.

Items players create using the mechanisms of the game have real-money implications and in no way do the creators wish to hide this fact through balkanized mechanisms.

The take-away is this: If you play this game and wish to make money at it we support that. Want to sell your hero? We support that. By playing the game you gain ownership of valuable in-game assets–as it should be. 

Remember, the player’s time is valuable.
## Planned Features
### Legendary item effects

### Item crafting

### In-game auction house

### User contributed cosmetics and art
    
## Commitment to the players
### We want a game in which money can play a part without it becoming evil:
    Players should be able to sell their characters, unlike in World of Warcraft.
    People without large disposable incomes should not be farmed by “whales.”
    Etcetera

### No loot boxes. Never ever. Any gambling on the site must be based on knowledge/skill.

### No predatory sales will ever be allowed. This is NOT diablo immortal.

## Threading the Needle of Pay-to-Win
For this version of the game the library’s token Culture Coin will play a role is the availability of loot and the purchase thereof. That means that aspects of the game will be pay-to-win. Therefore it is imperative we thread the needle and not fall into the traps other pay-to-win games fall into.

They say it cannot be done. However, it is possible with care. First off, the library’s token is the primary in-game currency. Heroes are minted with it, and items are bought and sold with it. It is the hope that the bookmarks heroes are minted from confer some advantage, or lack there of, given that bookmarks are a property that is ownable. Ownership should confer some privilege and in this “needle threading” they will.

First off the amount of reward gas locked in a bookmark should impact the quantity of loot available to the heroes minted from the bookmark. If a bookmark has no locked Culture Coin the bookmark for a scene only confers the scene level loot boost, say a 5% greater amount of loot from a mob killed within that scene for the heroes of that scene.

For example take scene one where Gaz is the main lootable mob. If your hero is minted from the bookmark for scene one, then when you loot Gaz with your hero you will receive 105 Gaz Identified ERC1155 tokens as loot, not the standard 100 of other heroes from all the other bookmarks.

However if Culture Coin has been locked into bookmark then the amount may be higher based on the following calculation: percent bonus is equal to the logarithm of CultureCoin divided by the normalization constant for the game. This constant is something like six or seven so that the locked Culture Coin bonus is effectively never greater than around 5%. So in the best case for a hero their bonus from killing Gaz may be as high as 10% more of the loot for killing and looting him.

So called “whales” should not have player power outrageously greater than people who do not have large sums of Culture Coin to throw away. Which brings us to the next section.
    
## The Library’s Philosophy on Games and Gaming
All games have issues which detract from the fun and while the library’s games will be no different, we strive to make any unfortunate aspects as innocuous as possible. We have a philosophy and it is that players should be able to enjoy all the content the game has to offer while by the time they reach 80% of the effective max power.
### The 80-20 rule
The 80-20 rule is a critical rule for understanding the library’s philosophy. The rule can be applied to many aspects of the game. Whales should only ever be able to get 20% more powerful than a minnow per unit time in the end game.
### No theft from the players
In Diablo II (d2) and Path of Exile (POE) if you die in the late game the game steals money and experience from you. This theft does not add anything to the game save to make it harder. It acts as a gatekeeper. But more importantly, it robs the player of fun. Also in D2 socketing a gem locks it in place and it cannot be removed without destroying it. Such destructive behavior from the game when it is not needed is also a form of theft.

If the game needs to burn tokens for economic reasons, then that process must be coded specifically to the problem and must give the player compensation in return. Having to nuke a gem or rune to replace it is not acceptable. Having to nuke them to upgrade something that can not be downgraded is much better.

### Caps are the enemy of flow
The best games allow the player to enter a state of mind known as flow and only breaks them out of flow when they fail to achieve an objective or when they succeed. This means that if the player sets out to do something, in the best world that thing they wish to do should be doable for as long as they wish it.

Therefore there should not be any caps to any activities. Such game design is coded to abuse the player into logging in everyday to do chores and the like. This is a big no no.
### Events are better than dailies
The use of events to entice people to play is much better than giving players daily chores in game.
### No abusive gambling
Life is a gamble. Everything we do is a gamble. But that doesn’t mean we should be addicted to gambling. Any gamble made in the game must be tied to skill, knowledge, or foresight. Loot boxes are right out.
### No parasitic design
All features should be synergistic. But what does that mean? It means that bolt-on systems are not allowed in the games. Movement is a synergistic design pattern in most RPGs. If you need to hit something out in the world with your staff, then you probably need to move to it.

If you are swinging your staff then having different swing timers is synergistic with the attack mode in question. However, once a game is made, adding on soulbinds like seen in World of Warcraft (WoW) do nothing but detract from the game. The same goes for outfitting pets and helpers like in Diablo III (d3.) Such systems detract from the game because they create unnecessary worry in the minds of the players. Instead of worrying about themselves and their friends they are worried about an NPC. This does nothing but make the game more complex without adding any real additional fun.

If the player has to have a helper, it is up to the game to outfit and supply the helper.
## Understanding Bookmarks Better
The text of a book is marked up to include section breaks. Each section is analogous to these bookmarks. On the site inside the html for the books a smart contract for the bookmarks supplies the ERC721 tokens that line up with these bookmarks/sections.
### Benefits of Ownership
They are critical to the game function as well as for petting BEN and other gambling mechanics on the site.
### Gambling on Bookmarks
The gamble will not be one that is based on pure luck. One must be able to predicate the future or have some skill to win.
### Petting BEN
Petting BEN is initially a way to interact with the AI custodian for the library. BEN is the friendly cat that likes to wander the digital stacks.
## Movement and Camera Controls in Game
Because the UI of any game is so critical, a theory of how it should work is important. Largely this game is inspired by the likes of Path of Exile (PoE) and World of Warcraft (WoW.) Because of the speed of the game and the need to target the spells and abilities, the WoWmodel of movement and camera control is what we are shooting for.

Clicking both mouse buttons will cause the player to move forward and then WASD can help modify those movements.

Targeting will require selecting the mobs individually at the start and possibly a location at some point for area of effect spells and abilities.
The Full Requirements: OxFxM 
Pronounced “Oh, cross Eff, cross Em,” the OxFxM model of requirements traceability is what this project uses for its main high level design and will include all of the great library. Operations are the highest level actions that users and AIs can take. Whereas the functionalities implement large swaths of these operations. The module level is the lowest level and is at the function or subroutine level of the code.

As a good developer, ask yourself why am I writing this code if there is no functionality it supports?

## The Pitch
We are pleased to introduce the next evolution of the written word. By blending artistic content, NFT’s, gaming and AI, we have leapt past the current saturated e-reader market and bring something new which marries the best of physical mediums with the ease of digital ones.

Take the humble book. It is physical, tactile, collectible. A library is a sign of culture to some, and speaks of your passion and interests. Books can take us to far away places, or teach us things we never thought were possible. They are, sadly, cumbersome, entirely static, and once read are stored, collecting dust.  But most damaging, there is a significant barrier to entry that barres all but the most easily marketed. New Authors have a steep hill to climb to enter into this tight market as the cost to print, store and distribute and market physical media is high, and publishers, facing an increasingly cluttered market fear to innovate.

E-Books tried to address this shortcoming, but have shortcomings of their own. Gone is the collect-ability, and the book is still static and unchanging. Barriers to entry are lessened to an extent that now virtually anyone can publish their tome, but in a saturated  market it is even more difficult and expensive to expose a new book to potential buyers. Some authors are experimenting with the Patreon system in an effort to serialize their writing and give their reoccurring fans early access in an effort to generate income, but this has met very limited success.

Smartbooks are radically different.  They are collectable and dynamic, capitalizing on the advantage of the digital medium, driving the story into hitherto unreached markets.  NFT tokens generated from the work proves exclusive ownership of a piece of literature, with the secure backbone of the crypto block-chain networks. Buy and sell on the integrated marketplace with other avid collectors and fans. Authors are automatically granted a portion of current and future resales through blockchain technology.  Reader apps give access from all HTML-5 devices, and instant feedback and AI tools guide the author in optimizing their success.  The sale of bookmarks, embedded games, and even advertisements will generate additional revenue and excitement.  There is almost no limit to the possible content, including limited artwork, AI pets, exclusive author access, audiobooks and even the distribution of limited edition physical media, yes, the old fashioned printed book. 

Ongoing revenue will be secured through the portion of sales perpetually generated in the NFT marketplace. Marketing and site placement are premiums for potential creators to place their offerings. Smart Media will become the standard for the future because it allows successful authors to interact with their public on a level that is not possible no other way.

## Operations
Welcome the high level operations that users can accomplish when using the software you are writing. These are the “Steve Jobs Level” concepts. These are what he worried about when he made his code. Is the user experience clean and consistent across all the operations the users partake in? At the highest level we do not worry about what functionalities are needed to implement, we simply assign them the functionalities needed to accomplish the goal and as we work through the operations we worry about the UX (user experience.)

### Connect to Network

### Mint One Bookmark

### Mint 1-10 Bookmarks with Rewards

### Purchase Bookmark

### Sell Bookmark

### Purchase Book

### Sell Bookmark

### Purchase Hardbound

### Read Book

### Save Book

### Pet BEN

### Mint Hero

### Sell Hero

### Launch Game

### Zone-In

## Functionalities


## Modules
async function getBENResponse(myPrompt)
Based on myPrompt BEN is to generate a text response using a GPT to provide an in-character response that follows from the prompt.

## A Case Study: Scene One

The users currently have to sign all their actions on chain but we will allow a bridge to remove that in the future. So say player1 zones into scene one:

    GAZ and RENNLY are fighting

    GAZ is an enemy NPC

    GAZ has 50 hp
    
    Player1 cast Druidfire by running the contract function: BaseLoot.sol::castDF()

    The transaction kills GAZ

    Player1 loots GAZ by calling: BaseLoot.sol::loot()


What this means in Unity is the user selects GAZ and pressed the 1 key which is mapped to “Druidfire” let’s say. So the unity CS code calls userPressed1Key(). Then inside that function it determines there is a mapping to Druidfire for key 1 and that the user wants to cast Druidfire.

So now inside userPressed1Key() a new function is called: doDruidFireForUser()

This function will call a contract function castDF() which requires the user to sign the tx using metamask or some wallet.

In the future, however, doDruidFireForUser() can call into bridging code on the cloud that will call castFD() on behalf of the user so they do not have to sign the transaction themselves. 

This new bridging ability will likely happen when we move to our own Avalanche Subnet.

## Loot and the “Cube”
TimeCube.sol was inspired by the great ether-monster in the sky. But what is it for? It is for controlling many aspects of the game, but primarily, users will use “the cube” to transmute the loot they get off of monsters and mobs in the game to create items: ERC721 items to be specific.

### A quick rundown of how loot works
When a lootable NPC dies, players calling the BaseLoot.sol:loot() contract function cause a mint of a new ERC1155 with the hero token id of the dead mob as its identifier. This ERC1155 is transferred to the msg.sender, AKA the player’s wallet.

Then the user has to call TimeCube.sol::transmute() to convert the ERC1155 to the ERC721 which is the item. Many pieces of loot may be required to create the best items in the game. So 1, 2, 3 or even 20+ ERC1155 loot tokens may be necessary to craft the best legendary items.
## Beyond Game-Fi
Maybe you aren’t a game developer but still want to contribute? We need to make the e-reader for the Great Library’s smart-books and a total reskin of the site. Skills include JS, REACT, PYTHON, WEB3 and many more. We are looking for people who are just starting their WEB3 journey as well as old hands at software development.

If you are interested in contributing in- or outside of the game email: johnrraymond@yahoo.com or see me on discord https://discord.gg/mdSKcX5PeE

You will still be paid even if you aren’t working on the game itself.

## The React Version of the Great Library
The current version of the website uses moralis’ vanilla js. This react initiative is two-fold. Part one is to replace the site with a react frontend that is maintainable in the ways js is not. The second push is to make a react-native e-reader for the books.

## The Secure Backend
The CCA private key should not be on disk in the .env file without being encrypted. Likewise the keys used for the ssl node server code should also be encrypted. The plan is to run the backend in GNU’s Screen. It requires the admin/librarian in charge of the server to type in the password to decrypt everything into memory, including the cCAPrivateKey.

To facilitate the transition, if the password is 1234 or fallback or blank, the value in the .env will not be decrypted but used directly.



    
~~Wagtail demo project:~~ Left for completeness
=======================

This is a demonstration project for the amazing [Wagtail CMS](https://github.com/wagtail/wagtail).

The demo site is designed to provide examples of common features and recipes to introduce you to Wagtail development. Beyond the code, it will also let you explore the admin / editorial interface of the CMS.

Note we do _not_ recommend using this project to start your own site - the demo is intended to be a springboard to get you started. Feel free to copy code from the demo into your own project.

### Wagtail Features Demonstrated in This Demo

This demo is aimed primarily at developers wanting to learn more about the internals of Wagtail, and assumes you'll be reading its source code. After browsing the features, pay special attention to code we've used for:

-   Dividing a project up into multiple apps
-   Custom content models and "contexts" in the "breads" and "locations" apps
-   A typical weblog in the "blog" app
-   Example of using a "base" app to contain misc additional functionality (e.g. Contact Form, About, etc.)
-   "StandardPage" model using mixins borrowed from other apps
-   Example of customizing the Wagtail Admin via _wagtail_hooks_
-   Example of using the Wagtail "snippets" system to represent bread categories, countries and ingredients
-   Example of a custom "Galleries" feature that pulls in images used in other content types in the system
-   Example of creating ManyToMany relationships via the Ingredients feature on BreadPage
-   Lots more

**Document contents**

- [Installation](#installation)
- [Next steps](#next-steps)
- [Contributing](#contributing)
- [Other notes](#other-notes)

# Installation

- [Gitpod](#setup-with-gitpod)
- [Vagrant](#setup-with-vagrant)
- [Docker](#setup-with-docker)
- [Virtualenv](#setup-with-virtualenv)
- [Heroku](#deploy-to-heroku)

If you want to see what Wagtail is all about, we suggest trying it out through [Gitpod](#setup-with-gitpod).
If you want to set up Wagtail locally instead, and you're new to Python and/or Django, we suggest you run this project on a Virtual Machine using [Vagrant](#setup-with-vagrant) or [Docker](#setup-with-docker) (whichever you're most comfortable with). Both Vagrant and Docker will help resolve common software dependency issues.
Developers more familiar with virtualenv and traditional Django app setup instructions should skip to [Setup with virtualenv](#setup-with-virtualenv).
If you want a publicly accessible demo site, [deploy to Heroku](#deploy-to-heroku).

Setup with Gitpod
-----------------

Setup a development environment and run this demo website with a single click (requires a Github account):

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/wagtail/bakerydemo/)

Once Gitpod has fully started, and a preview of the bakery website has appeared in the "Simple Browser" panel, click the arrow button to the right of the URL bar to open the website in a new tab.
Go to ``/admin/`` and login with ``admin / changeme``.

Setup with Vagrant
------------------

#### Dependencies
* [Vagrant](https://www.vagrantup.com/)
* [Virtualbox](https://www.virtualbox.org/)

#### Installation
Once you've installed the necessary dependencies run the following commands:

```bash
git clone https://github.com/wagtail/bakerydemo.git
cd bakerydemo
vagrant up
vagrant ssh
# then, within the SSH session:
./manage.py runserver 0.0.0.0:8000
```

The demo site will now be accessible at [http://localhost:8000/](http://localhost:8000/) and the Wagtail admin
interface at [http://localhost:8000/admin/](http://localhost:8000/admin/).

Log into the admin with the credentials ``admin / changeme``.

Use `Ctrl+c` to stop the local server. To stop the Vagrant environment, run `exit` then `vagrant halt`.

Setup with Docker
-----------------

#### Dependencies
* [Docker](https://docs.docker.com/engine/installation/)
* [Docker Compose](https://docs.docker.com/compose/install/)

### Installation
Run the following commands:

```bash
git clone https://github.com/wagtail/bakerydemo.git
cd bakerydemo
docker-compose up --build -d
docker-compose run app /venv/bin/python manage.py load_initial_data
docker-compose up
```

The demo site will now be accessible at [http://localhost:8000/](http://localhost:8000/) and the Wagtail admin
interface at [http://localhost:8000/admin/](http://localhost:8000/admin/).

Log into the admin with the credentials ``admin / changeme``.

**Important:** This `docker-compose.yml` is configured for local testing only, and is _not_ intended for production use.

### Debugging
To tail the logs from the Docker containers in realtime, run:

```bash
docker-compose logs -f
```

Setup with Virtualenv
---------------------
You can run the Wagtail demo locally without setting up Vagrant or Docker and simply use Virtualenv, which is the [recommended installation approach](https://docs.djangoproject.com/en/3.2/topics/install/#install-the-django-code) for Django itself.

#### Dependencies
* Python 3.6, 3.7, 3.8 or 3.9
* [Virtualenv](https://virtualenv.pypa.io/en/stable/installation/)
* [VirtualenvWrapper](https://virtualenvwrapper.readthedocs.io/en/latest/install.html) (optional)

### Installation

With [PIP](https://github.com/pypa/pip) and [virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/)
installed, run:

    mkvirtualenv wagtailbakerydemo
    python --version

Confirm that this is showing a compatible version of Python 3.x. If not, and you have multiple versions of Python installed on your system, you may need to specify the appropriate version when creating the virtualenv:

    deactivate
    rmvirtualenv wagtailbakerydemo
    mkvirtualenv wagtailbakerydemo --python=python3.9
    python --version

Now we're ready to set up the bakery demo project itself:

    cd ~/dev [or your preferred dev directory]
    git clone https://github.com/wagtail/bakerydemo.git
    cd bakerydemo
    pip install -r requirements/base.txt

Next, we'll set up our local environment variables. We use [django-dotenv](https://github.com/jpadilla/django-dotenv)
to help with this. It reads environment variables located in a file name `.env` in the top level directory of the project. The only variable we need to start is `DJANGO_SETTINGS_MODULE`:

    $ cp bakerydemo/settings/local.py.example bakerydemo/settings/local.py
    $ echo "DJANGO_SETTINGS_MODULE=bakerydemo.settings.local" > .env

To set up your database and load initial data, run the following commands:

    ./manage.py migrate
    ./manage.py load_initial_data
    ./manage.py runserver

Log into the admin with the credentials ``admin / changeme``.

Deploy to Heroku
----------------

If you want a publicly accessible demo site, use [Heroku's](https://heroku.com) one-click deployment solution to the free 'Hobby' tier:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/wagtail/bakerydemo)

If you do not have a Heroku account, clicking the above button will walk you through the steps
to generate one.  At this point you will be presented with a screen to configure your app. For our purposes,
we will accept all of the defaults and click `Deploy`.  The status of the deployment will dynamically
update in the browser. Once finished, click `View` to see the public site.

Log into the admin with the credentials ``admin / changeme``.

To prevent the demo site from regenerating a new Django `SECRET_KEY` each time Heroku restarts your site, you should set
a `DJANGO_SECRET_KEY` environment variable in Heroku using the web interace or the [CLI](https://devcenter.heroku.com/articles/heroku-cli). If using the CLI, you can set a `SECRET_KEY` like so:

    heroku config:set DJANGO_SECRET_KEY=changeme

To learn more about Heroku, read [Deploying Python and Django Apps on Heroku](https://devcenter.heroku.com/articles/deploying-python).

### Storing Wagtail Media Files on AWS S3

If you have deployed the demo site to Heroku or via Docker, you may want to perform some additional setup.  Heroku uses an
[ephemeral filesystem](https://devcenter.heroku.com/articles/dynos#ephemeral-filesystem), and Docker-based hosting
environments typically work in the same manner.  In laymen's terms, this means that uploaded images will disappear at a
minimum of once per day, and on each application deployment. To mitigate this, you can host your media on S3.

This documentation assumes that you have an AWS account, an IAM user, and a properly configured S3 bucket. These topics
are outside of the scope of this documentation; the following [blog post](https://wagtail.io/blog/amazon-s3-for-media-files/)
will walk you through those steps.

This demo site comes preconfigured with a production settings file that will enable S3 for uploaded media storage if
``AWS_STORAGE_BUCKET_NAME`` is defined in the shell environment. All you need to do is set the following environment
variables. If using Heroku, you will first need to install and configure the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli). Then, execute the following commands to set the aforementioned environment variables:

    heroku config:set AWS_STORAGE_BUCKET_NAME=changeme
    heroku config:set AWS_ACCESS_KEY_ID=changeme
    heroku config:set AWS_SECRET_ACCESS_KEY=changeme

Do not forget to replace the `changeme` with the actual values for your AWS account. If you're using a different hosting
environment, set the same environment variables there using the method appropriate for your environment.

Once Heroku restarts your application or your Docker container is refreshed, you should have persistent media storage!

Running `./manage.py load_initial_data` will copy local images to S3, but if you set up S3 after you ran it the first
time you might need to run it again.

# Next steps

Hopefully after you've experimented with the demo you'll want to create your own site. To do that you'll want to run the `wagtail start` command in your environment of choice. You can find more information in the [getting started Wagtail CMS docs](http://wagtail.readthedocs.io/en/latest/getting_started/index.html).


# Contributing

If you're a Python or Django developer, fork the repo and get stuck in! If you'd like to get involved you may find our [contributing guidelines](https://github.com/wagtail/bakerydemo/blob/master/contributing.md) a useful read.

### Preparing this archive for distribution

If you change content or images in this repo and need to prepare a new fixture file for export, do the following on a branch:

`./manage.py dumpdata --natural-foreign --indent 2 -e auth.permission -e contenttypes -e wagtailcore.GroupCollectionPermission -e wagtailimages.filter -e wagtailcore.pagerevision -e wagtailimages.rendition  -e sessions > bakerydemo/base/fixtures/bakerydemo.json`

Please optimize any included images to 1200px wide with JPEG compression at 60%. Note that `media/images` is ignored in the repo by `.gitignore` but `media/original_images` is not. Wagtail's local image "renditions" are excluded in the fixture recipe above.

Make a pull request to https://github.com/wagtail/bakerydemo

# Other notes

### Note on demo search

Because we can't (easily) use ElasticSearch for this demo, we use wagtail's native DB search.
However, native DB search can't search specific fields in our models on a generalized `Page` query.
So for demo purposes ONLY, we hard-code the model names we want to search into `search.views`, which is
not ideal. In production, use ElasticSearch and a simplified search query, per
[https://docs.wagtail.io/en/latest/topics/search/searching.html](https://docs.wagtail.io/en/latest/topics/search/searching.html).

### Sending email from the contact form

The following setting in `base.py` and `production.py` ensures that live email is not sent by the demo contact form.

`EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'`

In production on your own site, you'll need to change this to:

`EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'`

and configure [SMTP settings](https://docs.djangoproject.com/en/3.2/topics/email/#smtp-backend) appropriate for your email provider.

### Ownership of demo content

All content in the demo is public domain. Textual content in this project is either sourced from Wikipedia or is lorem ipsum. All images are from either Wikimedia Commons or other copyright-free sources.
