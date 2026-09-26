import type { Review } from "./types";

/* Shown when live Google reviews are not configured or unavailable.

   Provenance: copied word for word from the shop's Google Business Profile
   (Dallas Tint Shop, 630 S Central Expy #104, Richardson). The first three
   on 2026-08-12, the rest from the full review list on 2026-09-25.

   Left out on purpose (2026-09-25): reviews Google truncated ("… More"),
   Google translations, reviews containing emoji or em dashes (the site
   style bans both and a quote can't be edited), rating-only reviews,
   mixed ones (a 4-then-5 update, "a few blemishes"), one clearly meant for
   another business (eyebrow tint), and one written by the site's developer.

   What is deliberately NOT here:
   - Dates. Google showed only relative ages ("5 months ago") at the time,
     and converting those to dates would be inventing them.
   - The rating and review count. They were correct on 2026-08-12 and are
     not re-verified, so the page does not show them unless they come live
     from Google.
   - Vehicle summaries. Google reviews have no vehicle field; the old site
     added its own, which read as if Google had said it.

   Adding more: quote verbatim, keep the author's name as Google shows it,
   and check the listing — "Dallas Window Tint" at 10825 Plano Rd is a
   different company. */
/* The listing's total review count (5.0 rating), read off the Google
   Business Profile. Shown as "145+" so it stays true as reviews come in;
   bump it (and the date) now and then. If the rating ever drops below 5.0,
   the five stars beside it in GoogleReviews.tsx must change too. When live
   Google data is configured, the live rating and count replace it. */
export const GOOGLE_REVIEW_TOTAL = { count: 145, asOf: "2026-09-25" } as const;

export const CURATED_REVIEWS: Review[] = [
  {
    id: "uli-mar",
    authorName: "Uli Mar",
    rating: 5,
    text: "This place is AMAZING! If I can give 100 stars I would! Curly is the best, will get you right and make sure you are well taken care of!! I came in needing tint for my Lexus and these guys took their time and paid attention to detail and got my car looking right!",
  },
  {
    id: "trung-ha",
    authorName: "Trung Ha",
    rating: 5,
    text: "The team took the time to understand exactly what I was looking for and recommended the best tint solution based on my specific needs instead of trying to upsell me. The workmanship is flawless, the installation is incredibly clean, and the heat reduction is immediately noticeable.",
  },
  {
    id: "raul-camargo",
    authorName: "Raul Camargo",
    rating: 5,
    text: "They installed nano ceramic tint on all the windows of my 2026 Odyssey Van, and the results came out amazing. The customer service was professional, the installation was very clean, and you can immediately feel the difference in heat rejection.",
  },
  {
    id: "veronica-riggins",
    authorName: "Veronica Riggins",
    rating: 5,
    text: "Got the front windows on the Rivian tinted to match the back and helped drop the temp in the car significantly. Fast, affordable, and super professional. I didn’t have to wait and they made my time feel valuable. Not sure what else they do, but when I need something, I’ll go back 100 times.",
  },
  {
    id: "lawrence-shahwan",
    authorName: "Lawrence Shahwan",
    rating: 5,
    text: "Had chrome delete and powder coated rims on my GLE AmG 2024. They also did a full stealth ppf! Great work guys! Awesome customer service!",
  },
  {
    id: "miera-mohamed",
    authorName: "Miera Mohamed",
    rating: 5,
    text: "Needed my Ford Explorer tinted and this was the perfect place to get the job done. Knowledgable, professional, and super nice guys working here who will provide a quality job in a timely manner and make sure your car looks exactly how you want it. Can’t recommend this place enough.",
  },
  {
    id: "ryan-hernandez",
    authorName: "Ryan Hernandez",
    rating: 5,
    text: "Came in with my brand new Elantra N to get tinted up. THEY DID NOT DISAPPOINT!! They are absolutely incredible. Very very good at what they do. Owner is literally the best! Thank you guys so much!",
  },
  {
    id: "yousuf-s",
    authorName: "Yousuf S",
    rating: 5,
    text: "I brought in my S560 to get ppf and window tint, Curly went above and beyond my needs made my car look absolutely astounding. Amazing people amazing service they do it rite the first time and they always make sure you are more then happy with the work. I will always be back.",
  },
  {
    id: "garret-eason",
    authorName: "Garret Eason",
    rating: 5,
    text: "Amazing job protecting my car with front end PPF and walked me through the materials and warranty. Looks perfect",
  },
  {
    id: "grayson-quinn",
    authorName: "Grayson Quinn",
    rating: 5,
    text: "Went in as soon as they opened to get five windows tinted on my car and was done within about an hour. I’m bad with names but I think the younger guy introduced himself as Curly. Cool guy and professional. Pretty good pricing on ceramic and great installation overall.",
  },
  {
    id: "saad-tanveer",
    authorName: "Saad Tanveer",
    rating: 5,
    text: "Dallas Tint Shop did an absolute phenomenal job with the installation. Their attention to detail is unmatched. If you want elite tint and an installer who actually cares about his customers and his craft, this is the spot in town.",
  },
  {
    id: "ahmad-kato",
    authorName: "Ahmad Kato",
    rating: 5,
    text: "Got my car tinted with them and could not have went any better. Customer service is top notch. Amazing quality work I’ve had terrible experiences with tint shops in the past, now these guys are my go to. Highly recommend!! 10/10 experience.",
  },
  {
    id: "saad-yousuf",
    authorName: "Saad Yousuf",
    rating: 5,
    text: "The shop tinted taillights on my Porsche Macan and did a fantastic job. The owner was very nice and competitive with the price even though multiple shops said they couldn’t tint the tail lights. I would highly recommend everyone to the shop for their auto needs!",
  },
  {
    id: "ahmed-elmahi-ibrahim",
    authorName: "Ahmed Elmahi Ibrahim",
    rating: 5,
    text: "Curly is a great owner & professional worker. He knows how to deal with all kinds of windows. I highly recommend coming to his office!",
  },
  {
    id: "moe-daqah",
    authorName: "Moe Daqah",
    rating: 5,
    text: "Brought my baby here for a full ceramic coating and window tint, they did NOT disappointed. Will definitely bring my truck in next week for Moe to hook up with tint and front end ppf! Super happy with how everything came out. The front waiting room is super comfortable can’t wait to come back.",
  },
  {
    id: "laura-brunner",
    authorName: "Laura Brunner",
    rating: 5,
    text: "Excellent quality & customer service! You will not be disappointed! The owner will take time to educate on the product choices that fit your needs, install in a very timely manner, and he is also a very kind soul! A coworker loves my tint so much they plan to have this shop re-install what was done from a different tint shop.",
  },
  {
    id: "tierra-bell",
    authorName: "Tierra Bell",
    rating: 5,
    text: "Very pleased with my car window tint! The installation didn't take very long, it looks clean and professional. The price was very reasonable. Highly recommend their service!",
  },
  {
    id: "mike",
    authorName: "Mike",
    rating: 5,
    text: "Best service in the game took my hellcat here got it tinted in a timely manner while giving the best quality work. They tinted my vehicle with the full ceramic worth the money! Got my ride looking right!",
  },
  {
    id: "nico-luna",
    authorName: "Nico Luna",
    rating: 5,
    text: "Curley is beyond professional and a great business owner and Adrian did a great job on our expedition. I was in town for one day only and they came out of their way to get us taken care of. Great price for great work.",
  },
  {
    id: "alvin-alba",
    authorName: "Alvin Alba",
    rating: 5,
    text: "He fit me in for same day service in his busy day. Curly was prompt and took care of everything it looks pristine!",
  },
  {
    id: "ahmed",
    authorName: "Ahmed",
    rating: 5,
    text: "I am a perfectionist when it comes to my vehicles, and the team at Dallas Tint Shop did an amazing job! They know their stuff and really care about the work they do. They were also super easy to work with and took the time to explain every step. I definitely recommend them!",
  },
  {
    id: "mohammed-khatib-goodbye",
    authorName: "Mohammed Khatib (Goodbye)",
    rating: 5,
    text: "Brought in a Holden and few other cars, turn around time was faster than quoted, so I was able to make it to an event I wanted to be at thanks to these guys. I was prepared to go to multiple shops for different needs, but it’s definitely worth telling these guys everything you plan to do with your car. They actually can do everything",
  },
  {
    id: "christian-davila",
    authorName: "Christian Davila",
    rating: 5,
    text: "They paint corrected and ceramic coated my car! Had lots of swirls and scratches from car washes and they took them out effortlessly! I recommend them highly!",
  },
  {
    id: "khalil-h",
    authorName: "Khalil H",
    rating: 5,
    text: "Curly did a great job tinting my 4Runner for sure bringing all my vehicles here! Great people great service",
  },
  {
    id: "sylwia-szmidt",
    authorName: "Sylwia Szmidt",
    rating: 5,
    text: "Great job on my tint! The guys physically showed me the difference between all the options so I could make the decision on what darkness is right for me. Quick turn around. Everyone was super nice and respectful. Will definitely come back to get some other things done.",
  },
  {
    id: "alexandria-sanfilippo",
    authorName: "Alexandria Sanfilippo",
    rating: 5,
    text: "I schedule an appointment and decided to come in very last minute a few days before. They were more than willing to accommodate me and I really appreciate that. The owner was so sweet and very professional. I'd definitely recommend this place to anyone that I looking for a great and affordable tint job!",
  },
  {
    id: "salam-sayej",
    authorName: "Salam Sayej",
    rating: 5,
    text: "They did an excellent job on my window tint and chrome delete, everything came out looking great! Highly recommend, awesome people as well.",
  },
  {
    id: "fayez-d",
    authorName: "Fayez D",
    rating: 5,
    text: "Huge thank you to the owner and his people for making sure my truck came out 100 percent flawless and had it ready within the time they told me it would be. Bringing the rest of my vehicles here do not hesitate to have them work on your car or truck no matter what needs done. Will Be back!",
  },
  {
    id: "mike-junior",
    authorName: "Mike Junior",
    rating: 5,
    text: "Ali hooked it up they tinted my car, installed my lights and even wired the lights in my bumper! Clean work and amazing service will be using them again!",
  },
  {
    id: "jack-turner",
    authorName: "Jack Turner",
    rating: 5,
    text: "Look no further than Moe and his team. Been a customer of theirs for years and they have always been the best. Top notch customer service and pristine work. They treat everyone like family, and will never steer you wrong. 10/10",
  },
  {
    id: "eddie",
    authorName: "Eddie",
    rating: 5,
    text: "The professional staff were superb on applying ceramic tint to my car's windows. They were very welcoming, and informed me in what to know post-installation as well as care and maintenance. Highly recommend for their superb job!",
  },
  {
    id: "camille-love",
    authorName: "Camille Love",
    rating: 5,
    text: "Did an awesome job on my car. Fast and quality service! Will definitely be coming back here.",
  },
  {
    id: "ciara-west",
    authorName: "ciara west",
    rating: 5,
    text: "amazing customer service! the staff here is extremely friendly & helpful. the shop is clean, they make sure you’re comfortable & did a wonderful job tinting my car for an unbeatable price. no doubt you’ll be taken care of at this location !",
  },
  {
    id: "f-2-f",
    authorName: "F 2 F",
    rating: 5,
    text: "10 out of 10 these guys tinted my S5 did a fantastic job! I also got my A8 tinted and the guy up the recommended the perfect shade tint. Dallas tint shop is a name that’s held with dignity and the end result speaks for itself",
  },
  {
    id: "mohamed-hamadneh",
    authorName: "Mohamed Hamadneh",
    rating: 5,
    text: "No cutting corners these guys do nothing but the best and always perfection, flawless they tinted both of my cars detailed and every other service they do is always top of the line . Thank you guys for always having a great attitude and an amazing service and an experience",
  },
  {
    id: "lacresha-allen",
    authorName: "LaCresha Allen",
    rating: 5,
    text: "Took my Jaguar F-Pace there a few months ago, and let me say they did an awesome job! The staff were awesome as well, and the next vehicle I purchase will be going there as well.",
  },
  {
    id: "chris-otto",
    authorName: "Chris Otto",
    rating: 5,
    text: "I brought my truck in for a tint and ppf and was very well taken care of. The guys made the process very smooth and easy, would highly recommend.",
  },
  {
    id: "muhammad-ashraf",
    authorName: "Muhammad Ashraf",
    rating: 5,
    text: "Curly was extremely helpful and was able to help me pull the trigger and get a 5 year ppf done. it come out amazing! i would highly recommend to anyone!",
  },
  {
    id: "sherri-eidenberg",
    authorName: "Sherri Eidenberg",
    rating: 5,
    text: "Amazing service! Very welcoming and helped with cutting a place in our tint for a transponder. Found our Dallas Tint guy! Thank you Curly!",
  },
  {
    id: "jacob-baker",
    authorName: "Jacob Baker",
    rating: 5,
    text: "I have a classic truck, 1972 chevy, and the staff here tinted the windows so it would look extra clean for a show",
  },
  {
    id: "latasha-mckay",
    authorName: "Latasha McKay",
    rating: 5,
    text: "Called Curly and he got me in same day. Very professional and quick process. Would definitely recommend stopping by and seeing Curly for your tint needs.",
  },
  {
    id: "vika-venger",
    authorName: "Vika Venger",
    rating: 5,
    text: "Amazing tint job was done! I 100% recommend this place! Also, big thank you guys for hiding my dash cam wires!",
  },
  {
    id: "ben-chapman",
    authorName: "Ben Chapman",
    rating: 5,
    text: "Brought my car in and got tint service done.. Wow this looks great! Smooth process & will be bringing my other cars in! Looks to be the best job I’ve ever had done for this service!! Friendly place! Fair pricing!",
  },
  {
    id: "mike-z",
    authorName: "mike z",
    rating: 5,
    text: "Only people I’d trust to work on my 720s",
  },
  {
    id: "jawaad-barakat",
    authorName: "Jawaad Barakat",
    rating: 5,
    text: "Great customer service these people are awesome, completely trusted them with my hellcat and it came back exactly how I wanted it, would recommend over any other shop 10/10",
  },
  {
    id: "nakea-jackson",
    authorName: "Nakea Jackson",
    rating: 5,
    text: "Came in yesterday to get a quote and bought my car in today and got my windows tinted. Customer service was great and my car looks so good. Will definitely stick with Dallas Tint Shop!",
  },
  {
    id: "adi",
    authorName: "adi",
    rating: 5,
    text: "First time coming here, had an amazing experience. Very good customer service and great communication!! Recommended if your looking for something that’ll be done fast and in a good price range!!",
  },
  {
    id: "shawn-poore",
    authorName: "Shawn Poore",
    rating: 5,
    text: "Curley and team were awesome, service was great and they knocked my window tint out over my lunch hour!",
  },
  {
    id: "andy-hamadneh",
    authorName: "Andy Hamadneh",
    rating: 5,
    text: "Got my tint done here on my rs3 they did amazing work 10/10 would recommend",
  },
  {
    id: "rami-sheik-hossein",
    authorName: "Rami Sheik Hossein",
    rating: 5,
    text: "I just got my tow truck tinted here and I was in & out real quick and looks much better now.",
  },
  {
    id: "ruby-flores",
    authorName: "Ruby Flores",
    rating: 5,
    text: "I got the ceramic tint and I love it. Curly was a big help and provided great customer service, definitely recommend.",
  },
  {
    id: "jessica-barrientos",
    authorName: "Jessica Barrientos",
    rating: 5,
    text: "I brought my truck to this location, and I found the pricing to be reasonable. The timing was very efficient, and the service was outstanding. I would definitely recommend this establishment.",
  },
  {
    id: "rafat-hamam",
    authorName: "Rafat Hamam",
    rating: 5,
    text: "very professional staff with full knowledge. Work was fast and clean. Highly recommend this place And don’t forget price was very very affordable Compare any other Shop",
  },
  {
    id: "luke-renwick",
    authorName: "Luke Renwick",
    rating: 5,
    text: "Did a great job on my 2024 Mustang gt 10/10 great service.",
  },
  {
    id: "hamdan-hamdan",
    authorName: "hamdan hamdan",
    rating: 5,
    text: "Did a great job on my Escalade with full nano ceramic",
  },
  {
    id: "richard-martin",
    authorName: "Richard Martin",
    rating: 5,
    text: "Great place. I brought 2 cars in to have the front windows tinted and both turned out great. Highly recommend this establishment!",
  },
  {
    id: "nick-lupo",
    authorName: "Nick Lupo",
    rating: 5,
    text: "Great work and great to deal with. I see why they have so many 5 star reviews.",
  },
  {
    id: "em-martinez",
    authorName: "em martinez",
    rating: 5,
    text: "Great job on the window tint. Got the job done in an hour and no appointment. Thank you!",
  },
  {
    id: "dontae-johnson",
    authorName: "Dontae Johnson",
    rating: 5,
    text: "Great prices, great people to deal with. and it comes with a lifetime warranty! i’d bring my car here anytime.",
  },
  {
    id: "alex-c",
    authorName: "Alex C",
    rating: 5,
    text: "I got a tint job here and the guys did an excellent job. Great pricing, quick turnaround, friendly staff. I will definitely be coming here again!",
  },
  {
    id: "steve-winko",
    authorName: "Steve Winko",
    rating: 5,
    text: "I had a wonderful experience with the staff. they were very attentive and caring. I will definitely be bringing all my cars here.",
  },
  {
    id: "abdullah-khatib",
    authorName: "Abdullah Khatib",
    rating: 5,
    text: "Took my new tundra in..Prices were reasonable and service was great.",
  },
  {
    id: "waheed-zalal",
    authorName: "Waheed zalal",
    rating: 5,
    text: "Excellent work, very honest and respected person, take care of me and give me discount as well. My car looks more clean and great.",
  },
  {
    id: "lawan-lawan",
    authorName: "LAWAN LAWAN",
    rating: 5,
    text: "I get all my work done there! Great service and even better pricing. Best wrap shop in Dallas",
  },
  {
    id: "ward-salama",
    authorName: "Ward Salama",
    rating: 5,
    text: "Moe did a phenomenal job on my car, I’d give them more business again in the future.",
  },
  {
    id: "garrick-grimes",
    authorName: "Garrick Grimes",
    rating: 5,
    text: "Dudes here are great! Great job on my Tesla Tint!",
  },
  {
    id: "bilal-ahmed",
    authorName: "Bilal Ahmed",
    rating: 5,
    text: "If you're looking for some quality tint with lifetime warantee this is the place.. see Curly",
  },
  {
    id: "saulcarranza22",
    authorName: "saulcarranza22",
    rating: 5,
    text: "They did a great job fast turn around and now I’m riding with in style. Will be back for my other vehicle",
  },
  {
    id: "jenna-jasinski",
    authorName: "Jenna Jasinski",
    rating: 5,
    text: "Curly is great and made this whole process so smooth and fun!",
  },
  {
    id: "aiden-scott",
    authorName: "Aiden Scott",
    rating: 5,
    text: "Friendly, professional, and great people. Please go check them out, if you need work done.",
  },
  {
    id: "car-world",
    authorName: "Car World",
    rating: 5,
    text: "Best price in town fast no hassle. Respect to the owner.",
  },
  {
    id: "sam-johnsen",
    authorName: "Sam Johnsen",
    rating: 5,
    text: "Awesome service and communication - would absolutely recommend.",
  },
  {
    id: "will-b",
    authorName: "Will B",
    rating: 5,
    text: "Great staff and excellent work. I wouldn’t take my car any where else!",
  },
  {
    id: "ibrahim-daqah",
    authorName: "Ibrahim Daqah",
    rating: 5,
    text: "Awesome experience and great customer service. Quick turnaround time and reasonable price Highly recommended",
  },
  {
    id: "aaron-stone",
    authorName: "Aaron Stone",
    rating: 5,
    text: "Top tier shop right here! Best team in the DFW! 10 out of 10 would recommend",
  },
  {
    id: "aamer-alasaad",
    authorName: "aamer alasaad",
    rating: 5,
    text: "Amazing service , high quality service and material highly recommend come check them out !!!",
  },
  {
    id: "sariah-mcintosh",
    authorName: "Sariah McIntosh",
    rating: 5,
    text: "AMAZING WORK, AFFORDABLE, AND FAST!!!!!! CURLY DID A GREAT JOB!!!!!!!",
  },
  {
    id: "shayla-rojas",
    authorName: "Shayla Rojas",
    rating: 5,
    text: "very professional very accommodating i recommend to anyone who is looking for affordable prices for good quality",
  },
  {
    id: "bryce-beeson",
    authorName: "Bryce Beeson",
    rating: 5,
    text: "Great job over here. Got my tint done quick and well.",
  },
  {
    id: "najah-hamdan",
    authorName: "Najah Hamdan",
    rating: 5,
    text: "I took my car here to get tinted and they did an amazing job, i highly recommend them",
  },
  {
    id: "jonathan-palomo",
    authorName: "Jonathan Palomo",
    rating: 5,
    text: "great costumer service, great prices and great people.",
  },
  {
    id: "lesly-lopez",
    authorName: "Lesly Lopez",
    rating: 5,
    text: "Amazing staff. They get the job done! 100/10! Best shop around",
  },
  {
    id: "ben-bennett",
    authorName: "Ben Bennett",
    rating: 5,
    text: "Best place in the area! Great work at a great price.",
  },
  {
    id: "slick1262",
    authorName: "Slick1262",
    rating: 5,
    text: "Awesome place super friendly and great priceing with high quality tint",
  },
  {
    id: "alex-marin",
    authorName: "Alex Marin",
    rating: 5,
    text: "Great work, came out how I liked",
  },
  {
    id: "logan",
    authorName: "Logan",
    rating: 5,
    text: "They did a good job and really hooked me up! I highly recommend them 100%",
  },
  {
    id: "jourdon-strickland",
    authorName: "Jourdon Strickland",
    rating: 5,
    text: "Quality tints, stereos, and great service!",
  },
  {
    id: "anas-kalas",
    authorName: "Anas Kalas",
    rating: 5,
    text: "10/10 service. Very friendly and helpful people",
  },
  {
    id: "cecilia-segura",
    authorName: "Cecilia Segura",
    rating: 5,
    text: "Reasonable prices . Amazing people and great work .",
  },
  {
    id: "jake-turner",
    authorName: "Jake Turner",
    rating: 5,
    text: "Great guys and quality work. 10/10 recommend",
  },
  {
    id: "will-schu",
    authorName: "Will Schu",
    rating: 5,
    text: "Very chill, was able to get me the tint i was looking for",
  },
  {
    id: "anirudh-nemmani",
    authorName: "Anirudh Nemmani",
    rating: 5,
    text: "Easy, Quick, Quality tinting work!",
  },
  {
    id: "jane-kao",
    authorName: "Jane Kao",
    rating: 5,
    text: "Excellent customer service and very professional work.",
  },
  {
    id: "hayden-grant",
    authorName: "Hayden Grant",
    rating: 5,
    text: "Great service and timely work done.",
  },
  {
    id: "shaky-dave",
    authorName: "Shaky Dave",
    rating: 5,
    text: "Great service. Highly recommended",
  },
  {
    id: "matthew-perry",
    authorName: "Matthew Perry",
    rating: 5,
    text: "Amazing people, highly recommend",
  },
  {
    id: "shams-fardeen",
    authorName: "Shams Fardeen",
    rating: 5,
    text: "Perfect and friendly service!",
  },
  {
    id: "m-benaissa",
    authorName: "M Benaissa",
    rating: 5,
    text: "Loved the work and service",
  },
  {
    id: "ayan-rizvi",
    authorName: "Ayan rizvi",
    rating: 5,
    text: "Excellent Service",
  },
];
