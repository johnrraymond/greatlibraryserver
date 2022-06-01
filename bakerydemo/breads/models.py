import os
import shutil
from django import forms
from django.db import models
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.conf import settings


from modelcluster.fields import ParentalManyToManyField

from wagtail.admin.edit_handlers import (
    FieldPanel, MultiFieldPanel, StreamFieldPanel, FieldPanel,
)
from wagtail.core.fields import StreamField
from wagtail.core.models import Page
from wagtail.search import index
from wagtail.snippets.models import register_snippet
from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.core.signals import page_published

from bakerydemo.base.blocks import BaseStreamBlock

#from djrichtextfield.models import RichTextField
from ckeditor.fields import RichTextField

#from froala_editor.fields import FroalaField
#from froala_editor.widgets import FroalaEditor


#import nlpcloud
import json
from simplejson.compat import StringIO

#client = nlpcloud.Client("gpt-j", "6983b33710c3d8b777fcbb2883a947edd6489a12")

def getcurrentsymbolfilter(title):
    myfilter = """
Book Titles to Smart Book Symbols: Digest 1:
How to go from a text name to a crypto property’s symbol?
No Symbol may start with “BOOK” – they are counterfeit.
The symbol should be short yet recognizable.
The symbol should be diverse enough from others that plenty of space is left in the space of all reasonable symbols.
WUYTYSUUHDSFSJHDS   ← Too long
AQ  ← Too short
WEDSWS  ← Just about perfect.
The starting letters of the name of phonemes of the title should be prioritized.
The Lightshy Crow: TLSC
A Study In Scarlet: ASIS
Tom Swift and His Airship: TSHS    ← This one is a little odd and could be TSAHAS or TSHAS
Alice In Wonderland: AIWL
Other examples:
The Count of Monte Cristo: TCOMC
Knights of the Garter: KNTG
Champions of the East: COTEA
The Darkbringer: TDBR
"""
    return myfilter + title + ": "



@register_snippet
class Country(models.Model):
    """
    A Django model to store set of countries of origin.
    It uses the `@register_snippet` decorator to allow it to be accessible
    via the Snippets UI (e.g. /admin/snippets/breads/country/) In the BreadPage
    model you'll see we use a ForeignKey to create the relationship between
    Country and BreadPage. This allows a single relationship (e.g only one
    Country can be added) that is one-way (e.g. Country will have no way to
    access related BreadPage objects).
    """

    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Countries of Origin"


@register_snippet
class BreadIngredient(models.Model):
    """
    Standard Django model that is displayed as a snippet within the admin due
    to the `@register_snippet` decorator. We use a new piece of functionality
    available to Wagtail called the ParentalManyToManyField on the BreadPage
    model to display this. The Wagtail Docs give a slightly more detailed example
    https://docs.wagtail.io/en/latest/getting_started/tutorial.html#categories
    """
    name = models.CharField(max_length=255)

    panels = [
        FieldPanel('name'),
    ]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Bread ingredients'


@register_snippet
class BreadType(models.Model):
    """
    A Django model to define the bread type
    It uses the `@register_snippet` decorator to allow it to be accessible
    via the Snippets UI. In the BreadPage model you'll see we use a ForeignKey
    to create the relationship between BreadType and BreadPage. This allows a
    single relationship (e.g only one BreadType can be added) that is one-way
    (e.g. BreadType will have no way to access related BreadPage objects)
    """

    title = models.CharField(max_length=255)

    panels = [
        FieldPanel('title'),
    ]

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Bread types"


class DataMineIndexPage(Page):
    """
    Index page for the DataMine subapp
    """
    FIXME = 'FIXME'


class DataMinePage(Page):
    FIXME = 'FIXME Need to make this a forieng key into the breads/books'

FROALA_EDITOR_OPTIONS = {
    'toolbarInline': False,
    'fontSize': {
        'options': [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96]
    },
    'moreText': {

    'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']

    },

    'moreParagraph': {

        'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']

    },

    'moreRich': {

        'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']

    },

    'moreMisc': {

         'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],

         'align': 'right',

         'buttonsVisible': 2

    },

}


class BreadPage(Page):
    """
    Detail view for a specific bread
    """
    introduction = models.TextField(
        help_text='Make any additional promises to your readers here.',
        blank=True)

    authorwallet = models.CharField(
        max_length=255,
        help_text='The wallet address of the author of this book.',
        blank=True)
    curserial_number = models.TextField(
        help_text='the current nft serial number',
        blank=True)
    datamine = models.CharField(
        unique=True,
        max_length=255,
        help_text='the location of the datamine for this piece',
        blank=True)

    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='Landscape mode only; horizontal width between 1000px and 3000px.'
    )

    bookmark = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='This is the template bookmark.'
    )

    body = StreamField(
        BaseStreamBlock(), verbose_name="Page body", blank=True
    )
    origin = models.ForeignKey(
        Country,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    # We include related_name='+' to avoid name collisions on relationships.
    # e.g. there are two FooPage models in two different apps,
    # and they both have a FK to bread_type, they'll both try to create a
    # relationship called `foopage_objects` that will throw a valueError on
    # collision.
    bread_type = models.ForeignKey(
        'breads.BreadType',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    
    usejrreditor = models.BooleanField(default=False)
    jrreditor = RichTextField(blank=True)
    #jrreditor = FroalaField(theme='dark')

    ingredients = ParentalManyToManyField('BreadIngredient', blank=True)


    startpoint = models.TextField(
        help_text='the startpoint of this piece',
        blank=True)

    maxbooksupply = models.TextField(
            help_text='the max number of books this smart book has. -1 == infinity',
            blank = True,)

    bperbookmark = models.TextField(
            help_text='number of bytes per bookmark. Warning Compete with the next. Use one or other. ',
            blank = True,)

    maxbookmarksupply =models.TextField(
            help_text='number of bytes per bookmark. Warning Compete with the previous. Use one or other. ',
            blank = True,)

    bookmarkprice = models.TextField(
            help_text='the price of a single bookmark.',
            blank = True,)

    bookprice = models.TextField(
            help_text='the price of a single book.',
            blank = True,)

    hardbound = models.TextField(
            help_text='how many hardbound books are in this smart book. -1 means infinite.',
            blank = True,)
    hardboundprice = models.TextField(
            help_text='the price of a single hardbound book in MATIC.',
            blank = True,)
    hardboundfrom = models.TextField(
            help_text='where to start autoselling hardbounds from.',
            blank = True,)

    content_panels = Page.content_panels + [
        ImageChooserPanel('image'),
        MultiFieldPanel([
            StreamFieldPanel('authorwallet'),
            ImageChooserPanel('bookmark'),
            StreamFieldPanel('body'),
            StreamFieldPanel('curserial_number'),
            StreamFieldPanel('datamine'),
            FieldPanel('origin'),
            FieldPanel('bread_type'),
            ], 
            heading="Book Details",
            classname="collapsible collapsed"),

        FieldPanel('usejrreditor'),
        FieldPanel('jrreditor', classname="full"),
        MultiFieldPanel(
            [
                FieldPanel(
                    'ingredients',
                    widget=forms.CheckboxSelectMultiple,
                ),
                StreamFieldPanel('bookprice'),
                StreamFieldPanel('bookmarkprice'),
                StreamFieldPanel('maxbooksupply'),
                StreamFieldPanel('bperbookmark'),
                StreamFieldPanel('maxbookmarksupply'),
                StreamFieldPanel('startpoint'),
                StreamFieldPanel('hardbound'),
                StreamFieldPanel('hardboundfrom'),
                StreamFieldPanel('hardboundprice'),

            ],
            heading="Additional Metadata",
            classname="collapsible collapsed"
        ),
    ]

    search_fields = Page.search_fields + [
        index.SearchField('body'),
    ]


    parent_page_types = ['BreadsIndexPage']




def datamine_path(datamine):
    return os.path.join(settings.DATAMINEROOT, datamine)

def datamine_verify(datamine):
    """
    Make the directory if needed.
    """
    if not os.path.exists(datamine_path(datamine)):
        os.makedirs(datamine_path(datamine))

def datamine_get_index(datamine):
    return  "/mnt/media_dir/" + datamine + "/jrre-index.html"

def datamine_get_bookmark(datamine):
    return  "/mnt/media_dir/" + datamine + "/jrre-bookmark.png"

def jrreditor_publish(page, text):
    """
    Publish the text of the jrreditor to the datamine
    """

    datamine_verify(page.datamine)

    htmlfile = datamine_get_index(page.datamine)
    f = open(htmlfile, 'w')
    text.replace("&nbsp;", "<JRRE-NBSP>")
    f.write(text)
    f.close()

    try:
        wagtailbookmark = page.bookmark.file.path
        bookmarkfile = datamine_get_bookmark(page.datamine)

        if os.path.exists(wagtailbookmark):
            shutil.copyfile(wagtailbookmark, bookmarkfile)
        else:
            print("No bookmark file found")
    except:
        print("No bookmark file found")



# Do something clever for each model type
def book_page_published(**kwargs):
    self = kwargs['instance']
    if self.datamine == "":
        #myfirstsymbols = client.generation(getcurrentsymbolfilter(self.title), min_length=10, max_length=50, remove_input=True)
        #self.datamine = myfirstsymbols['generated_text'].strip();
        self.save()
        return

    if self.usejrreditor:
        text = """
        <html><head><title>{title}</title></head><body>
        """ + self.jrreditor + """
        </body></html>
        """

        jrreditor_publish(self, text)
        return


    return

# Register listeners for each page model class
page_published.connect(book_page_published, sender=BreadPage)



class BreadsIndexPage(Page):
    """
    Index page for breads.

    This is more complex than other index pages on the bakery demo site as we've
    included pagination. We've separated the different aspects of the index page
    to be discrete functions to make it easier to follow
    """

    introduction = models.TextField(
        help_text='Text to describe the page',
        blank=True)
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='Landscape mode only; horizontal width between 1000px and '
        '3000px.'
    )

    content_panels = Page.content_panels + [
        FieldPanel('introduction', classname="full"),
        ImageChooserPanel('image'),
    ]

    # Can only have BreadPage children
    subpage_types = ['BreadPage']

    # Returns a queryset of BreadPage objects that are live, that are direct
    # descendants of this index page with most recent first
    def get_breads(self):
        return BreadPage.objects.live().descendant_of(
            self).order_by('-first_published_at')

    # Allows child objects (e.g. BreadPage objects) to be accessible via the
    # template. We use this on the HomePage to display child items of featured
    # content
    def children(self):
        return self.get_children().specific().live()

    # Pagination for the index page. We use the `django.core.paginator` as any
    # standard Django app would, but the difference here being we have it as a
    # method on the model rather than within a view function
    def paginate(self, request, *args):
        page = request.GET.get('page')
        paginator = Paginator(self.get_breads(), 1200)
        try:
            pages = paginator.page(page)
        except PageNotAnInteger:
            pages = paginator.page(1)
        except EmptyPage:
            pages = paginator.page(paginator.num_pages)
        return pages

    # Returns the above to the get_context method that is used to populate the
    # template
    def get_context(self, request):
        context = super(BreadsIndexPage, self).get_context(request)

        # BreadPage objects (get_breads) are passed through pagination
        breads = self.paginate(request, self.get_breads())

        context['breads'] = breads

        return context
