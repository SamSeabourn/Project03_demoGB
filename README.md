
# DemoGB  - Try, share and buy real Gameboy games.

### General Assembly SEI31

### About Demo GB


Inspired by the growing community of people developing games for the original Gameboy, I decided to build a platform that would allow people to share their own demos and trial games that other developers had made. In addition I wanted to be able to produce physical copies of these games for the 1989 console, so I bought the hardware to do so.  
  
This app demonstrates a JavaScript Gameboy emulator running in the browser and the ability to upload, mount and play .gb files from cloud storage. This app was built in just over a week using Node.js, Express, Mongo.DB, Bcrypt and Cloudinary. I designed this platform mobile-first as I wanted to focus on making the app user friendly for mobile users.  
  
As part of this project I built and published a game as a proof of concept. The game is a little story about myself and is fully playable on the site as well as on console.

![](/images/demoGB.gif)


### **Learnings**

With this app I learned a lot about Node.js and Express. I really like the ease of Express and how quickly you build with it. One thing I really liked is how you can write standard HTML files. This helped a lot when it came to imbedding scripts in the page to run the Gameboy.
DemoGB also allowed me to learn about NoSQL with MongoDB. I really like the flexibility of MongoDB and setting up schemas with JavaScript was a huge plus.


### **Hosted Site**
[https://demomygb.herokuapp.com/](https://demomygb.herokuapp.com/)

### **Potential Updates.**
- Would like to implement JWT and OAuth. Currenlty running sessions. 
- Get Stripe payments working would be a huge plus 
- Deploy to custom domain name
- Get a small user base working with a few users sharing
