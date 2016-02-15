# Exercice étape 14 : affichage (incomplet) du dialogue ajouter/modifier

Nous venons de dérouler ensemble le code nécessaire à connecter les options de menu contextuel "Supprimer" à une boîte de dialogue dédiée, et à traiter l'annulation et la confirmation de cette question.

## Objectifs

1.  Déclinez le cheminement de code de la suppression pour la modification, sans aller jusqu'à implémenter le `onAdd` à ce stade.
2.  Implémentez également le bouton Ajouter pour ouvrir le dialogue en mode ajout (plutôt que modification).

## Étapes

1.  Déclinez `openGoalDeleter` en `openGoalEditor`.
2.  Appelez-la dans le `onEditClick` des `GoalSetting`s
3.  Ajoutez le `AddSettingDialog`, paramétré de façon similaire au `DeleteSettingDialog` mais sans `onDelete` ni `onAdd`, et sensible à la valeur de `this.state.dialog` que vous aurez définie en (1).
4.  Déclinez `openGoalEditor` en `openGoalAdder`.
5.  Appelez-la dans le `onClick` du `RaisedButton`

## Astuces

`openGoalAdder` n'a aucun argument à recevoir ; du coup, pensez à simplifier son appel depuis le JSX, et à le déclarer de façon à garantir le `this` à l'intérieur.

Le formulaire d'ajout/modification décline bien ses titres et boutons, mais les champs restent obstinément gelés sur leurs valeurs par défaut… Sauras-tu comprendre pourquoi en regardant le code de `AddSettingDialog` et la façon dont ton propre code l'instancie ?
