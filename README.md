# changelog-maker

## Language Used
Javascript

## Current version
 Tag Version - ![version](https://img.shields.io/github/v/tag/JaavLex/changelog-maker)
 
 App Version - ![version](https://img.shields.io/github/package-json/v/JaavLex/changelog-maker)

## Latest version's website
https://jaavlex.github.io/changelog-maker/

## What is changelog-maker ?

changelog-maker is a website that generates a changelog based on a **github's** (only github) repository commits. It will sort fixes, features, and refactors on this current version. But may later include the creation of other categories to sort based on user input.

*A changelog is used to list changes made to an application or overall repository within a certain timeframe for example.*

## Usage

*Mandatory fields (for now are not enforced, but will soon be) are marked by a `*`*

### Repository Field *
Here you need to put the repository's location on **github** or the url.

#### Format
*user/repo*

#### Example
*JaavLex/changelog-maker*

**OR**

*https://github.com/JaavLex/changelog-maker*

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
## ✨ New features

[COMMITHASHHERE] - My commit message 

## 🐛 Bug fixes

[COMMITHASHHERE] - My commit message 2
```

#### "Yes" result
```
## ✨ New features

[COMMITHASHHERE] - feat: My commit message 

## 🐛 Bug fixes

[COMMITHASHHERE] - fix: My commit message 2
```

---

### Show balises on others
Gives you the option of removing balises in the other category. (the other category is where commits that couldn't be sorted will end up)

It will remove by default, the first word of the commit message.

---

### Include Merges
Gives you the option to show merge messages

#### "No" result
```
## 📚 Other types of commits

[COMMITHASHHERE] - My commit message 2
[COMMITHASHHERE] - Merge branch 'blablah' ...
```

#### "Yes" result
```
## 📚 Other types of commits

[COMMITHASHHERE] - My commit message 2
```

---

### Generate Markdown or HTML
Gives you the option to see your changelog in HTML or in Markdown syntax

#### "Markdown" result
```
# 📑 Changelog

## ✨ New features

[[COMMITHASHHERE](COMMITHASHLINKHERE)] - My commit message 1

[[COMMITHASHHERE](COMMITHASHLINKHERE)] - My commit message 2

[[COMMITHASHHERE](COMMITHASHLINKHERE)] - My commit message 3
```

#### "HTML" result

##### 📑 Changelog

###### ✨ New features

[[COMMITHASHHERE](COMMITHASHLINKHERE)] - My commit message 1

[[COMMITHASHHERE](COMMITHASHLINKHERE)] - My commit message 2

[[COMMITHASHHERE](COMMITHASHLINKHERE)] - My commit message 3

---

### Balises lists
![image](https://user-images.githubusercontent.com/50820503/129583211-eb9bee4c-fa21-46dc-939f-559c7aacc89e.png)

Commits are sorted based on those lists. You can add some keywords that will sort your commits in a certain category, or reset them.

You can also **Change the title of a category**

#### Default example

```
# 📑 Changelog

## ✨ New features 

[[COMMITHASHHERE](COMMITHASHLINKHERE)] - My commit message 1
```

#### Changed title example


```
# 📑 Changelog

## 💯💯💯 AMAZING NEW EXCLUSIVE FEATURES !!!

[[COMMITHASHHERE](COMMITHASHLINKHERE)] - My commit message 1
```

Or remove a single keyword, just type the keyword **exactly** how it is written in the delete field and click the button to the left of it

#### Custom Lists

There's 2 custom category lists :

![image](https://user-images.githubusercontent.com/50820503/129584079-a397103e-6eb5-40a0-adfa-e6c50311e79e.png)

If you want one more category, just add your keywords. If you don't want them, just leave the list empty and it won't create the category whatsoever
