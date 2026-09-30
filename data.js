// Demo data only. Later: replace with Firestore reads (see README).
const CATS=[["electrician","Electrician","⚡"],["plumber","Plumber","🚰"],["carpenter","Carpenter","🪚"],["painter","Painter","🎨"],["mechanic","Mechanic","🔧"],["ac","AC Repair","❄️"],["tailor","Tailor","🧵"],["cleaner","Cleaner","🧹"],["tutor","Tutor","📚"],["other","Other Services","✨"]];
const LOCS=["Jhalawar","Jhalrapatan","Bhawani Mandi","Aklera"];
const W=[
["Anil Sharma","electrician","Wiring & Repairs","Civil Lines",8,"Hindi, Hadoti","From ₹300 / visit","Sample profile: home wiring, fan and switchboard repair.",200],
["Imran Khan","plumber","Pipe & Bathroom Fitting","Station Road",6,"Hindi, English","From ₹250 / visit","Sample profile: leak repair, tap and tank fitting.",210],
["Suresh Suthar","carpenter","Furniture & Doors","Purani Bazaar",12,"Hindi, Hadoti","₹700 / day","Sample profile: custom cupboards, doors and repairs.",30],
["Deepak Meena","painter","Interior Painting","Kisan Colony",5,"Hindi","₹18 / sq ft","Sample profile: wall painting and putty finishing.",340],
["Rakesh Gurjar","mechanic","Two-wheeler Mechanic","Chhawani",10,"Hindi, Hadoti","From ₹200","Sample profile: bike servicing and puncture repair.",15],
["Vikram Rathore","ac","AC Service & Repair","Gangdhar Chouraha",7,"Hindi, English","From ₹500 / service","Sample profile: split AC servicing and gas check.",190],
["Sunita Devi","tailor","Stitching & Alteration","Jhalrapatan Road",9,"Hindi, Hadoti","From ₹150","Sample profile: suits, blouses and alterations.",320],
["Kavita Bai","cleaner","Home Deep Cleaning","Dag Road",4,"Hindi","From ₹1,200 / home","Sample profile: kitchen, bathroom and floor cleaning.",150],
["Pooja Joshi","tutor","Maths & Science Tutor","Civil Lines",6,"Hindi, English","₹400 / hour","Sample profile: classes 6–10 home tuition.",260],
["Manish Patel","electrician","Inverter & Appliance Repair","Kisan Colony",11,"Hindi, English","From ₹350 / visit","Sample profile: inverter, geyser and appliance repair.",45],
["Lokesh Nagar","other","Event & Tent Decoration","Purani Bazaar",8,"Hindi, Hadoti","On request","Sample profile: small event set-up and decoration.",280]
].map((r,i)=>({id:i,name:r[0],cat:r[1],skill:r[2],area:r[3],exp:r[4],langs:r[5],price:r[6],about:r[7],hue:r[8],city:"Jhalawar"}));
const FAQ=[["Are these real workers?","No. Every profile in this prototype is a fictional demo profile."],["Can I contact a worker now?","Not yet. Contact and request buttons are visual placeholders."],["Are workers verified?","Not in this demo. Identity and credentials are not verified."],["Does it cost anything?","Pricing and plans are not decided. Nothing is charged in this prototype."],["When will registration open?","Real registration will be enabled in a later version."]];
