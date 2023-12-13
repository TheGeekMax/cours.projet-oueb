# Résumé de django

## TD0 - rappel

### modèle MVC

Le modèle MVC est un modèle de conception qui permet de séparer les données, la logique et l'interface utilisateur d'une application. Il est composé de trois parties :

![Modèle MVC](/pictures/pics/mvc.png)

### modèle MVC dans django

Django utilise le modèle MVC, mais il le nomme MTV (Modèle Template Vue). Il est composé de trois parties :

![Modèle MTV](/pictures/pics/mtc.png)

## TD1 - instalation

### 1.1 - Installation du module et du projet

Pour installer django, il faut utiliser la commande suivante :

```bash
pip install django
```

Pour créer un projet django, il faut utiliser la commande suivante :

```bash
django-admin startproject nom_du_projet
```

### 1.2 - commandes utiles pour le projet

Pour lancer le serveur, il faut utiliser la commande suivante :

```bash
python manage.py runserver
```

et sur un port spécifique :

```bash
python manage.py runserver 8080
```

Pour créer une application, il faut utiliser la commande suivante :

```bash
python manage.py startapp nom_de_l_application
```

### 1.3 - creation de notre premiere vue (au sens controller)

vous pouvez créer une vue dans le fichier views.py de votre application. Pour cela, il faut utiliser le code suivant :

```python
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello world!")

def hello(request, name):
    return HttpResponse("Hello" + name)
```

Pour utiliser cette vue, il faut créer un fichier urls.py dans votre application. Pour cela, il faut utiliser le code suivant :

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('hello/<name>', views.hello, name='hello'),
]
```

Pour utiliser cette vue, il faut ajouter le fichier urls.py de votre application dans le fichier urls.py de votre projet. Pour cela, il faut utiliser le code suivant :

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('polls/', include('polls.urls')),
    path('admin/', admin.site.urls),
]
```

## TD2 - les BDDs

### 2.1 - l'instalation

pour generer les differentes tables venant des differentes applications, il faut utiliser la commande suivante :

```bash
python manage.py migrate
```

### 2.2 - la creation des models

pour creer un model, il faut, dans le fichier models.py de votre application, utiliser le code suivant :

```python
from django.db import models

class Example(models.Model):
    name = models.CharField(max_length=200)
    age = models.IntegerField(default=0)
    date = models.DateTimeField('date published')

    def __str__(self):
        return self.name
    
    def published_recently(self):
        return self.date >= timezone.now() - datetime.timedelta(days=1)

class Example2(models.Model):
    example = models.ForeignKey(Example, on_delete=models.CASCADE)
    date = models.DateTimeField('date published')
```

(les differents types de fields sont disponibles [ici](https://docs.djangoproject.com/fr/4.1/ref/models/fields/#field-types))

puis ajouter dans INSTALLED_APPS dans le fichier settings.py de votre projet, le nom de la fonction dans application/apps.py. Pour cela, il faut utiliser le code suivant :

```python
INSTALLED_APPS = [
    'application.apps.AppConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
]
```

(ici pour le poll ca serait `polls.apps.PollsConfig`)

puis enfin, pour generer les differentes tables venant des differentes applications, il faut utiliser la commande suivante :

```bash
python manage.py makemigrations application
python manage.py migrate
```

### 2.3 - ajouter des elements a la main

pour ajouter des elements a la main, il faut utiliser la commande suivante :

```bash
python manage.py shell
```

puis utilisez le code suivant :

```python
from polls.models import Example, Example2
from django.utils import timezone
e = Example(name="test", age=0, date=timezone.now())
e.save()
e2 = Example2(example=e, date=timezone.now())
e2.save()

# pour afficher les elements
Example.objects.all()
Example2.objects.all()

# pour afficher les elements avec un filtre
Example.objects.filter(name="test")

# pour afficher les elements associé a une autre table par une cle etrangere
e.example2_set.all()
## ici ca va retourner [e2]
```

### 2.4 - le panel d'administration

#### creation d'un compte

pour creer un compte admin, il faut utiliser la commande suivante :

```bash
python manage.py createsuperuser
```

puis suivre les instructions

et enfin allez sur l'adresse suivante : http://localhost:8000/admin/

#### pour modifier des elements de la BDD dans le panel admin

pour modifier des elements de la BDD dans le panel admin, il faut utiliser le code suivant dans le fichier application/admin.py de votre application :


```python
from django.contrib import admin
from .models import Example, Example2

admin.site.register(Example)
admin.site.register(Example2)
```

#### recuperer des elements de la BDD dans le code

pour recuperer tout les elements :

```python
latest_example_list = Example.objects.all()
```

pour recuperer les elements avec un filtre :

```python
latest_example_list = Example.objects.filter(name="test")
```

pour recuperer un element :

```python
latest_example_list = Example.objects.get(pk=1)
```

## TD3 - les templates

### 3.1 - le language de template

#### les variables

pour afficher une variable, il faut utiliser le code suivant :

```html
{{ variable }}
```

exemple :

```python
from django.template import Template, Context

def index(request):
    txt = Template("Hello {{ name }}!")
    ctx = Context({
        'name': 'world'
    })
    return HttpResponse(txt.render(ctx, request))
```

#### les filtres

pour utiliser un filtre, il faut utiliser le code suivant :

```html
{{ variable|filter }}
```

exemple :

```python
from django.template import Template, Context

def index(request):
    txt = Template("Hello {{ name|upper }}!")
    ctx = Context({
        'name': 'world'
    })
    return HttpResponse(txt.render(ctx, request))
```

#### les tags

pour utiliser un tag, il faut utiliser le code suivant :

```html
{% tag %}
```

exemple :

```python
from django.template import Template, Context

def index(request):
    txt = Template("Hello {% if name %}{{ name }}{% else %}world{% endif %}!")
    ctx = Context({
        'name': 'world'
    })
    return HttpResponse(txt.render(ctx, request))
```

#### les boucles

pour utiliser une boucle, il faut utiliser le code suivant :

```html
{% for item in list %}
    {{ item }}
{% endfor %}
```

exemple :

```python
from django.template import Template, Context

def index(request):
    txt = Template("Hello {% for item in list %}{{ item }}{% endfor %}!")
    ctx = Context({
        'list': ['world', 'world2']
    })
    return HttpResponse(txt.render(ctx, request))
```

#### les urls dynamiques

pour utiliser une url dynamique, il faut utiliser le code suivant :

```html
{% url 'name' arg1 arg2 %}
```

et dans urls.py de votre application, il faut utiliser le code suivant :

```python
from django.urls import path
from . import views

app_name = 'polls'
urlpatterns = [
    path('', views.index, name='index'),
    ...
]
```

exemple :

```python
from django.template import Template, Context

def index(request):
    txt = Template("Hello <a href=\"{% url 'hello' name %}\">world</a>!")
    ctx = Context({
        'name': 'world'
    })
    return HttpResponse(txt.render(ctx, request))
```

le url 'name' est le nom de l'url dans le fichier urls.py de votre application

### 3.2 - les templates

creez un dossier templates/application dans votre application (ici polls/templates/polls)

ajoutez-y vos differents templates (fichiers .html)

puis utilisez le code suivant dans le fichier views.py de votre application :

```python
from django.shortcuts import render

def index(request):
    return render(request, 'polls/index.html', {'name': 'world'})
```

render a le role de recup le fichier polls/index.html et de le rendre avec les variables {'name': 'world'}

### 3.3 - les templates herites

pour utiliser un template herite, il faut utiliser le code suivant :

```html
{% extends "base.html" %}
```

exemple :

dans base.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{% block title %}{% endblock %}</title>
</head>
<body>
    {% block content %}{% endblock %}
</body>
</html>
```

dans index.html
```html
{% extends "base.html" %}

{% block title %}Hello{% endblock %}

{% block content %}
    Hello world!
{% endblock %}
```

#### ajouter des template dans TOUT le projet

pour ajouter des template dans TOUT le projet, il faut modifier le code suivant dans le fichier `settings.py` de votre projet :

```python
TEMPLATES = [
    {
        ...
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
        ],
        ...
    },
]
```

puis de creer le dossier templates a la racine du projet

### 3.4 - l'erreur 404

pour utiliser l'erreur 404, il faut utiliser le code suivant dans le fichier views.py de votre application :

```python
from django.shortcuts import render, get_object_or_404
from django.http import Http404

def index(request):
    try:
        e = Example.objects.get(pk=1)
    except Example.DoesNotExist:
        raise Http404("Example does not exist")
    return render(request, 'polls/index.html', {'name': 'world'})
```

ou

```python
from django.shortcuts import render, get_object_or_404
from django.http import Http404

def index(request):
    e = get_object_or_404(Example, pk=1)
    return render(request, 'polls/index.html', {'name': 'world'})
```

### 3.5 - le dossier static

le dossier static permet de stocker les differents fichiers statiques (css, js, images, etc...)

pour en ajouter un, il faut creer un dossier static dans votre application (ici polls/static/polls)

pour l'utiliser ensuite dans un template, il faut utiliser le code suivant :

```html
{% load static %}
<img src="{% static 'polls/image.png' %}" alt="My image"/>
```

## TD4 - les formulaires

### les formulaires manuels

en utilisant le TD2, vous pouvez avec les templates generer le form

pour recuperer le form, vous devez faire

```html
<form action="{% url 'app:name' arg1 arg2 arg3%}" method="post">
    {% csrf_token %}
    <!-- form -->
    <input type="submit" value="Submit">
</form>
```

puis dans le fichier views.py de votre application, vous devez faire

```python
from django.shortcuts import render, get_object_or_404
from django.http import Http404

def view(request):
    if request.method == 'POST':
        # traite le form
        v1 = request.POST['v1']
        ...
    else:
        # affiche le site de form
```

### les formulaires automatiques

pour creer un formulaire automatique, il est courrant de creer forms.py dans votre application pour creer les forms automatiques:

completez le avec :

```python
from django import forms

class ExampleForm(forms.Form):
    v1 = forms.CharField(label='v1', max_length=100)
    v2 = forms.CharField(label='v2', max_length=100)
    ...
```

puis dans le fichier views.py de votre application, vous devez faire

```python
from django.shortcuts import render, get_object_or_404
from django.http import Http404
from .forms import ExampleForm

def view(request):
    if request.method == 'POST':
        form = ExampleForm(request.POST)
        if form.is_valid():
            # traite le form
            v1 = form.cleaned_data['v1']
            ...
    else:
        form = ExampleForm()
    return render(request, 'polls/index.html', {'form': form})
```

### formulaire a partir d'un model

pour creer un formulaire a partir d'un model, il est courrant de creer forms.py dans votre application pour creer les forms automatiques:

completez le avec :

```python
from django import forms
from .models import Example

class ExampleForm(forms.ModelForm):
    class Meta:
        model = Example
        fields = ('v1', 'v2', ...)
```

puis dans le fichier views.py de votre application, vous devez faire

```python
from django.shortcuts import render, get_object_or_404
from django.http import Http404
from .forms import ExampleForm

def view(request):
    if request.method == 'POST':
        form = ExampleForm(request.POST)
        if form.is_valid():
            # traite le form
            form.save()
    else:
        form = ExampleForm()
    return render(request, 'polls/index.html', {'form': form})
```