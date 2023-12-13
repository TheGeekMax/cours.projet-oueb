# git/github a 101 course

## Introduction

git et github sont 2 outils bien distinct, permettant de gérer des projets de développement. Git permet, comme sont ancêtre SVN, de gérer les versions de son code, mais permet aussi de gerer un systeme de branche (cf suite du cours), ce qui permet le travail en paralelle. Github est un service web permettant d'heberger des projets git, et de les partager avec d'autres personnes.

### Git

Comme dit plus tot, git est un outil de gestion de version. Il permet de gérer les versions de son code, et de revenir à une version antérieur si besoin. Il permet aussi de travailler en paralelle sur un même projet, en créant des branches. Il est aussi possible de fusionner des branches entre elles, pour avoir un code final.

En revanche, tout cela ce fait en local, et en aucun cas git communique entre les ordinateurs. C'est la que github intervient.

### Github

Github est un service web permettant d'heberger des projets git. Il permet de partager son code avec d'autres personnes, et de travailler en équipe. il a toutes les fonctionnalités de git, avec un concepte en plus, qui diffère de svn, les pull request. Sur svn vous aviez la possibilité de faire des commit, et tout s'envoyé sur le serveur sans vous demander votre avis. Sur github, vous pouvez faire des pull request, qui permettent de demander à l'administrateur du projet de fusionner votre code avec le sien. Cela permet de faire des revues de code, et de ne pas avoir de code qui ne fonctionne pas sur le projet.

## Instalation

bon passons au choses serieuses. insallons git !

### Linux

Sur linux, git est disponible dans les dépots de votre distribution. Pour l'installer, il suffit de taper la commande suivante dans un terminal :

```bash
sudo apt-get install git
```

### Windows

Windows c'est de la merde, mais bon, on va quand même vous expliquer comment installer git dessus. Pour cela, il suffit de télécharger le [fichier d'installation](https://git-scm.com/download/win) et de l'executer.

### Mac

Sur mac, il suffit d'installer [homebrew](http://brew.sh/), puis d'executer la commande suivante :

```bash
brew install git
```

## Utilisation dans les projets

### recuperer un projet

Pour recuperer un projet, il suffit de taper la commande suivante :

```bash
git clone https://url/du/projet.git
cd ProjetOueb
```

### pour commencer a travailler

verifier que vous etes sur la derniere version du projet :

```bash
git pull
```

puis creer une branche pour travailler :

```bash
git branch nomDeLaFeature
git checkout nomDeLaFeature
```

### pour envoyer son travail

```bash
git add .
git commit -m "message de commit"
git push origin nomDeLaFeature
```

si c'est la premiere fois que vous envoyez votre branche, il faut faire :

```bash
git push --set-upstream origin nomDeLaFeature
```

pour le lier a un fix de bug ou une feature, il faut faire :

```bash
git commit -m "message de commit" -m "fix #numeroDuBug"
```

### pour fusionner son travail

Pour fusionner son travail, il faut faire une pull request sur github. Pour cela, il faut aller sur la page du projet, et cliquer sur le bouton "New pull request". Il faut ensuite choisir la branche a fusionner, et la branche de destination. Il faut ensuite cliquer sur "Create pull request", et attendre que *l'administrateur* du projet accepte la pull request.

### après la fusion

Une fois la pull request acceptée, il faut supprimer la branche de travail, et mettre a jour la branche de dev :

```bash
git checkout main
git pull
```

