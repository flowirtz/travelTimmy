# TravelTimmy
## All your business trips in your teams' home: Twist.
![TravelTimmy Logo](http://traveltimmy.com/tt_circ_yellow@2x.png)

## About
Staying on top of your business trips is pretty hard:

> Where did I leave the boarding pass again?
> Did I book my flight yet?

**TravelTimmy** takes the strain out of travelling for business.
Ask Timmy to get you a quote for the flight to your next destination. Rest assured that you get access to the cheapest flights, thanks to the [Skyscanner](https://skyscanner.com) API. <br>
Like the flight? Book it instantly via their platform and lean back - Timmy takes care of your ticket as well and has it ready when you need it. All of that from the comfort of your favourite communication tool [Twist](https://twistapp.com).

This project was developed during [HackUPC](http://hackupc.com) in Barcelona.
**It is an MVP, not a ready to use product.**

## Technology
The bot is written in pure Javascript (Node.js). We wrote the whole chatbot ourselves, using only a Finite State Machine and **no fancy Chatbot API** or helper. We connect to APIs provided by [Skyscanner](https://skyscanner.com) and integrate with [Twist](https://twistapp.com) by doist.
The bot is hosted in an EC2 instance on AWS, running Node.js behind a NginX proxy that is supported by Let's encrypt.
The domain for our landing page is provided by Domain.com.

## Before running
Install using `npm install`.
Then export this env var: `export GOOGLE_APPLICATION_CREDENTIALS=~(...)travelTimmy/config/HackUPC2017-24270e308d6f.json`.
