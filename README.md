# changelog-maker

## Language Used
Javascript

## Current version
![version](https://img.shields.io/github/v/tag/JaavLex/changelog-maker)

## Latest version's website
https://jaavlex.github.io/changelog-maker/

## What is changelog-maker ?

changelog-maker is a website that generates a changelog based on a **github's** (only github) repository commits. It will sort fixes, features, and refactors on this current version. But may later include the creation of other categories to sort based on user input.

*A changelog is used to list changes made to an application or overall repository within a certain timeframe for example.*

## Usage

*Mandatory fields (for now are not enforced, but will soon be) are marked by a `*`*

### Repository Field *
Here you need to put the repository's location on **github**. However it is **not** the url you need to input but only the user/organization and repository name.

#### Format
*user/repo*

#### Example
*JaavLex/changelog-maker*

---

### API token field *
Here you need to put a github app API token, it permits you to make more requests to the API, and thus is necessary for longer repositories. Here is a **[tutorial](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)** on how to generate one

#### Example
*ghg_ABCDEFGHIJKLMNOPQRS:12212314342*

---

### Commit since field
Here you can input a date, it will only show you commits made **after** said date.

*Normally, there is a datetime field on the website so you shouldn't worry about the format. But it may not work on Firefox browsers, thus you will need to input a date in the formatted date yourself.*

#### Format
*YYYY-MM-DDTHH:MM:SSZ*

#### Example
*2021-08-10T13:40:00Z*

---

### Commit until field 
Here you can input a date, it will only show you commits made **before** said date.

Note: You can of course fill in both the since and until field. You will have the commits made during the timespan you have inputted

#### Format
*YYYY-MM-DDTHH:MM:SSZ*

#### Example
*2021-08-10T13:40:00Z*

---

### Show balises option
Gives you the option of showing commit balises (balises are what commit types are recognized with f.e: **feat:** my commit message) while still sorting them.

#### "No" result
```
## Features

[COMMITHASHHERE] - My commit message 

## Fixes

[COMMITHASHHERE] - My commit message 2
```

#### "Yes" result
```
## Features

[COMMITHASHHERE] - feat: My commit message 

## Fixes

[COMMITHASHHERE] - fix: My commit message 2
```

---

### Show balises on others - **NOT CURRENTLY WORKING**
Gives you the option of removing balises in the other category. (the other category is where commits that couldn't be sorted will end up)

---

### Include Merges - **NOT CURRENTLY WORKING**
Gives you the option to show merge messages

---

### Balises lists
![image](https://user-images.githubusercontent.com/50820503/128861822-dcea9146-9d6e-4827-aefc-7c6353eff3d1.png)

Commits are sorted based on those lists. You can add some keywords that will sort your commits in a certain category, or reset them.
