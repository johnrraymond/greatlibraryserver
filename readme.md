# Welcome to The Great Library
=======================

This code contains four main parts:

1. the website as a wagtail bakerydemo
2. the code for creating the smart html
3. the code for creating and managing the tokens on the backend
4. the unity code for the game 

Looking to help? :: https://docs.google.com/document/d/1_2A2VKrus-1Mt6fdsahudrLe1-SW-HSPZbnvKFJZ984/edit?usp=sharing

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

. ./wagtailbakerydemo/bin/activate

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
```

~~python3 -m pip uninstall python-dotenv~~ # for AttributeError: module 'dotenv' has no attribute 'read_dotenv'

```
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
brownie run scripts/deployCultureCoinProxy.py  --network=avax-test

brownie run scripts/deployMarketPlace.py  --network=avax-test
brownie run scripts/deployPrintingPress.py --network=avax-test

# Deploy the game parts that you can
brownie run scripts/deployBaseSpells.py  --network=avax-test                ## baseSpellsImplAddress
brownie run scripts/deployBaseSpellsProxy.py  --network=avax-test           ## baseSpellsAddress
brownie run scripts/deployBaseLoot.py  --network=avax-test                  ## baseLootAddress

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

## Deploy the rest of the game contracts using a bookmark contract for bookmmarkAddress in the .env (e.g. bookmarkAddress="0x9d3f59e810ec2250adcc3aa5947e48d6d927850b" )
```
brownie run scripts/deployMyItems.py --network=avax-test                ## myItemsAddress
brownie run scripts/deployHero.py --network=avax-test                   ## heroAddress
brownie run scripts/deployTimeCube.py --network=avax-test               ## timeCubeImplAddress
brownie run scripts/deployTimeCubeProxy.py --network=avax-test          ## timeCubeAddress
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

# The Glorious End to Part 1

The site should be working…. https://droplet.greatlibrary.io/admin/login/?next=/admin/  Login with you username and password.
Part 2: Brownie / Web3


# RUN INSECURE DEV SITE
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


## Enter the deploy directory for the site

```
cd bakerydemo/brownie

############ Possible issue: if your username is something like: joe
PermissionError: [Errno 13] Permission denied: '/home/john/bakerydemo/brownie/build'
joe@preprod:/home/john/bakerydemo/brownie$ sudo chown -R joe:john .
############
```

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
