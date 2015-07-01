mixing native application components with a WebView (special browser window) that can access device-level APIs, or if you want to develop a plugin interface between native and WebView components.

A plugin interface is available for Cordova and native components to communicate with each other. This enables you to invoke native code from JavaScript. All plugins, even the core plugins, must be explicitly added. Cordova does not provide any UI widgets or MV frameworks. Cordova provides only the runtime in which those can execute.

#### config.xml

It provides information about the app and specifies parameters affecting how it works, such as whether it responds to orientation shifts for Packaged Web App, or widget, specification.

```bash
cordova info # a listing of potentially useful details

# generates a skeletal web-based application whose home page is the project's www/index.html file
# Create a new app. cordova create <PATH> <a reverse domain-style identifier> <App display title>
cordova create hello com.example.hello HelloWorld

# Add/Remove Platforms: android, blackberry10, firefoxos, etc. affects the contents of the project's platforms dir
cordova platform add ios
cordova platform rm android
# After you run the npm command above to update Cordova
cordova platform update ios

# Build the App
# cordova build command is a shorthand: cordova prepare ios && cordova compile ios
cordova build
cordova build ios  # generates platform-specific code within the project's platforms subdirectory

# Test the App on an Emulator or Device
cordova emulate android

# deploy the app on a connected iOS device
cordova run ios --device
# deploy the app on a default iOS emulator
cordova emulate ios
cordova run ios -- --justlaunch

# see all available targets
cordova run ios --list
# run application on a specific device or emulator ex: cordova run ios --target="iPhone-6"
cordova run ios --target=target_name

# http://cordova.apache.org/docs/en/5.0.0/guide_cli_index.md.html#The%20Command-Line%20Interface
cordova plugin search bar code
cordova plugin ls # view currently installed plugins
cordova plugin add cordova-plugin-network-information  # specify the repository for the plugin code
cordova plugin add cordova-plugin-console@0.2.1  # plugin's version number appended after an @ character
cordova plugin add https://github.com/apache/cordova-plugin-console.git#r0.2.0
cordova plugin rm cordova-plugin-console  # To remove a plugin
```

## Card Project

http://stackoverflow.com/questions/21006701/is-it-possible-to-find-other-nearby-phones

In WeChat, if i turn off Location service, Output message:  Unable to get your location data. Please enable location service in "Settings"->"Privacy"->"Location Service" and allow WeChat to get your location data.


Peer-to-Peer architecture:  have clients joining the network, and finding each other, and interacting

as fasr as I know, there's no pre-existing plugins for bluetooth LE, but that would bound your range, and is likely to be less error prone

coordinating/communicating with a server using geolocation architecture:(Device Geolocation)

I'm positive that most places that'd do this are using a back-end server to coordinate. with geolocation, you risk poor GPS
striaght forward, but is likely more error-prone,


you'll need to learn cordova's APIs, you'll need to understand GIS concepts for your regional limiting, and you'll need to think through what you want the server to do


once my device detect the other device, I want to transfer some info between two phone. so the server communicate between two devices sounds ok, does not it?

everything you'd need for this is built into cordova proper


WiFi connection with a server through internet + device geolocation.
Server keeps positions of users and answers questions like "who is 20 feet in my range?". The problem can be the precision of geolocation. If the walls are thick or you are in a place on earth with few satellites - it can be very inaccurate.
iOS, at least, supplements GPS with WiFi access point geolocation. The most populous locations with poor GPS are urban canyons and building interiors, and they tend to have WiFi access points.


 There is greater probability that somebody will have WiFi turned on all the time than BT. BT also have some time limits after which it is turned off (they make it this way to probably save battery). So, WiFi seems a better choice than BT.

## [Geolocation](http://diveintohtml5.info/geolocation.html) <- must read

The second method actually uses dedicated GPS hardware on your device to talk to dedicated GPS positioning satellites that are orbiting the Earth. GPS can usually pinpoint your location within a few meters. The downside is that the dedicated GPS chip on your device draws a lot of power, so phones and other general purpose mobile devices usually turn off the chip until it’s needed. That means there will be a startup delay while the chip is initializing its connection with the GPS satellites in the sky.

If you’ve ever used Google Maps on an iPhone or other smartphone, you’ve seen both methods in action. First you see a large circle that approximates your position (finding the nearest cell tower), then a smaller circle (triangulating with other cell towers), then a single dot with an exaction position (given by GPS satellites).

The reason I mention this is that, depending on your web application, you may not need high accuracy. If you’re just looking for nearby movie listings, a “low accuracy” location is probably good enough.

If the getCurrentPosition() function could not find your location — either because you declined to give your permission, or the geolocation API failed for some reason, run Error function.

How Geolocation Works

GPS is the most accurate way to determine positioning, but it’s less energy efficient than other options and sometimes requires a lengthy startup time.
A-GPS (assistive GPS) uses triangulation between mobile phone towers and public masts to determine location. Although not as precise as GPS, A-GPS is sufficient for many scenarios.
Mobile devices that support Wi-Fi access points can use hotspots to determine the user’s location.
Stationary computers without wireless devices can obtain rough location information using known IP address ranges.

When it comes to sharing the physical location of users, privacy is a serious concern. According to the Geolocation API, “user agents must not send location information to Web sites without the express permission of the user.” In other words, a user must always opt in to share location information with a Web site. Figure 2 shows a typical message requesting a user’s permission. For more information about ensuring security with the Geolocation API, see Security and privacy considerations.


How Does GeoLocation Work?
From GPS (for GPS-enabled devices) to the less accurate cell-tower triangulation and client IP address, the GeoLocation API determines a user’s coordinates—the latitude and the longitude—through various methods available to the browser client.

a GPS-enabled smartphone, Typically, geolocation apps do two things: They report your location to other users, and they associate real-world locations (such as restaurants and events) to your location. Geolocation apps that run on mobile devices provide a richer experience than those that run on desktop PCs because the relevant data you send and receive changes as your location changes.Smartphones today have a GPS chip inside, and the chip uses satellite data to calculate your exact position (usually when you're outside and the sky is clear), which services such as Google Maps can then map. When a GPS signal is unavailable, geolocation apps can use information from cell towers to triangulate your approximate position

The latitude and longitude attributes are geographic coordinates specified in decimal degrees.

The altitude attribute denotes the height of the position, specified in meters above the [WGS84] ellipsoid. If the implementation cannot provide altitude information, the value of this attribute must be null.

The accuracy attribute denotes the accuracy level of the latitude and longitude coordinates. It is specified in meters and must be supported by all implementations. The value of the accuracy attribute must be a non-negative real number.

Find my ip:   http://whatismyipaddress.com/
Hide my ip:  http://whatismyipaddress.com/hide-ip
http://whatismyipaddress.com/geolocation

## What is geolocation?

frequently related to GPS technology. The term, geolocation, refers to the ability to determine the position of an object or a person using their geographical coordinates (latitude and longitude) on a regular map through any of the available technologies. This technology will determine the way in which we acquire the information necessary for the geolocation through the identification of the IP of a device connected to the Internet, the network provider or mobile device GSM network or through GPS.

Geolocation technologies

Through GPS: modern browsers allow to obtain information from a GPS receiver. This is very common in the case of mobile devices. It is the slowest method of all, but it’s very accurate. It is the most reliable and it provides the greatest coverage. GPS: Global Positioning System, is a network of 24 satellites placed in geostationary orbit at about 20,000 km from the Earth. They are provided with atomic clocks that allow them to transmit accurate time and position in space.
Examples: dedicated devices, some smartphones, navigation systems.

Wi Fi networks Proximity: this technology analyzes the names and MAC addresses of the Wi Fi networks placed near us and these data allows us to find out exactly where we are. In some cases, when a device combines this technology with GPS, it can reload the database so we can find the information about where the different wireless networks are. There is an hybrid system that combines this technology with GPS. It can be the best solution for indoor geolocation, where the GPS signal is weak or non-existent.
Examples: smartphones.

Mobile repeater triangulation: this method is mostly used on mobile devices’ browsers. It’s based on the relative distance to several cell phone towers. This system is fast, but very expensive (some companies block the access because the cost isn’t very competitive). Its accuracy is great if we are in an urban environment where there are many phone towers, but if we are in a rural area we will have problems when locating our position.
Example: mobile with the two last generations, some smartphones use it as an alternative, 3G connections.

IP Address: this technology is the least accurate and it’s used for a long time now. It uses the IP address associated with your service provider (ISP). There are many scripts and new standards that offer location through the IP address, but it isn’t well accepted because of its inaccuracy (if we are connected through a proxy or a tunnel it will give us the location of this IP instead of ours).
Examples: computers and devices with Internet connection.

## Geolocation service

http://en.wikipedia.org/wiki/Geosocial_networking

Geolocation services have access to a number of databases (different kinds) that give them the information needed to locate someone online through their IP address. A primary source for IP address data is the Regional Internet Registries. These are large, official organizations responsible for managing and distributing IP addresses in specific regions of the world. You can read more about RIRs here. The RIR for North America is called the American Registry for Internet Numbers (ARIN).

A service might probe data sources where your IP address has shown up before. For example, if you went to an online weather site and typed in your city or ZIP code, that information was linked to your IP address because you made the request online in real time. (That's why you get such instant and accurate weather data with a simple query.)

Some Internet Service Providers (ISPs) also may contribute information to databases that is helpful to geolocation services. The services might use statistical formulas and other sophisticated analytical tools and analyze the data submitted by us in our specific online activities. This helps them fine-tune their search and improve their service to subscribers.


[Super awesome Geo post](http://www.andygup.net/how-accurate-is-html5-geolocation-really-part-2-mobile-web/)
http://www.andygup.net/html5-geolocation-api-getting-the-best-single-location/

The great news is that the usage of HTML5 location services along-side the fact that there is a GPS chipset in most, if not all, modern smartphones and tablets dramatically improves the chances of getting an accurate location.

What’s different about desktop vs. mobile HTML5 Geolocation? With mobile you can access the GPS if it’s available. It’s important to note that in order to access a device GPS you have to set the optional enableHighAccuracy property in your code.

How accurate is it? When using enableHighAccuracy() on a phone where all the appropriate permissions have been selected and granted, I’ve typically seen accuracy readings as low as 3 meters (~10 feet) that were obtained within 10 – 30 seconds of kicking off the geolocation functionality. You should be aware that like any location-based functionality you will get spurious (abnormal) results that fall way outside the norm, and sometimes these results are wildly wrong.

enableHighAccuracy() property won't slows down the phones ability to deliver a location. It is true that the GPS, itself, can take a significant amount of time to warm up and start delivering high accuracy results.

Why HTML5 Geolocation rather than native? Applications using HTML5 Geolocation typically have slightly different requirements than native GPS-based applications. Each platform has its advantages and disadvantages and it all comes down to your requirements, budget, timeframes and skill sets:
Ability to re-use existing JavaScript and HTML5 skills to build a high-accuracy mobile application.
Don’t have access to native platform developers or skillsets on Android, iPhone and/or Windows Phone.
Need a cross-platform stand-alone web app, or a web app that has been repurposed to work with PhoneGap or Titanium.
Quickly locate the user/consumer within a reasonable expectation of accuracy.
Typically it is a non-commercial, consumer grade application that does not have extremely high accuracy requirements (e.g. < 1 meter).

How fast can I get an initial location result? The answer is very fast, potentially within a few seconds, given the following scenarios:
If there was a cached GPS or Network location stored on the phone. The GPS location is, of course, from the GPS chipset. The Network location comes from your wireless carrier and is dependent on your phone and their capabilities.
How the timeout and maximumAge properties are set. If you set timeout = 0 and maximumAge = Infinity it will force the application to grab any cached location, if one is available. Other settings may result in delays.
If the phone or tablet has decent internet connectivity and Wifi enabled.
If the device is in an urban area with many wifi nodes broadcasting their SSIDs nearby.
The device has a clear and uninterrupted view of the sky. GPS’s listen for a very weak signal from multiple satellites. These signals can be partially or completely blocked by buildings, thick foliage, vehicle roofs, etc.


 How accurate is the initial location result?

 Hah, you might have guessed I’d say that it depends.  When you first kick off a geolocation request, accuracy does depend on a number of different factors that are mentioned above. And it’s safe to say that, in the vast majority of cases, the first location is not the most accurate and typically not the most dependable. If you want the fastest, most accurate location possible then you will most likely need to either do multiple snapshots, or use watchLocation until your desired level of accuracy is met. It’s important to note because I’ve been asked about this many times, you cannot expect the GPS, itself, to have enough time to lock onto a satellite and deliver a fast, accurate initial location. It may take dozens of seconds or even minutes. Yep, it’s true. Factors that affect initial location accuracy include:
Cached locations – how recently the user accessed location functionality. For example, applications like Facebook typically grab a location when you open the app. So frequent users of social media are more likely to have a fresh, cached location that non-social media users. If you are targeting business travelers, the cached location might the last city before they got on a plane. Or, it could be your home neighborhood and not where you work or go to games.
Wifi turned “on”. If the Wifi is turned on then the device can access the location service and there is a much greater chance that the initial result is fairly accurate. If you didn’t have a chance to read Part 1, when the Wifi is on your browser gathers local Wifi node information from your Wifi card, and it can use that information in a location service provider request over the internet to try and triangulate your position. Typically this means your initial location can be within a block or two of the actual position. Also, it is possible if Wifi is turned on that you can get a significantly more accurate initial location than if you were using GPS by itself with no Wifi or internet.
Internet connectivity strength. If you have a poor internet connection and no Wifi, then the browser’s requests to the location service can be delayed, blocked or even interrupted.
No VPN. Take note commercial application developers: as mentioned in Part 1, if VPN software is in use it can wildly affect accuracy and even place you in another State (or Country).


Most smartphones and tablets use a consumer-grade GPS chip and antenna, and that limits the potential accuracy and precision. On average, the best possible accuracy is typically between 3 and 10 meters, or 10 – 33 feet. This is based on my own extensive experience building GPS-based mobile apps and working with many customers who are also using mobile apps. Under the most ideal scenario, the device will be kept stationary in one location until the desired accuracy number is achieved.

You will not know where the location information is coming from. There’s no way to tell if it’s from the GPS, the cellular provider or the browser vendors location service. If you care about these things then the native Android SDK, for example, gives you a huge amount of control over what they call ‘location providers.’

You’ll have very limited control over battery usage. Second only to the screen on your phone or tablet, the current generation of GPS chips are major energy hogs and can suck down your battery very quickly. Since the Geolocation API gives you very little control over how it works you cannot build much efficiency into your apps.


## Location Options

http://abbianengineering.com/blog/?tag=geolocation

Finally, Google offers a Geolocation API that allows you to send the ID of the cell tower that the modem is connected to (along with signal strength and slot information for GSM modems) and obtain the location of the cell tower with an accuracy radius that the device should be within.  The radius is not fixed – since cellular networks are  more congested during the day, a daytime fix will have a tighter radius than a nighttime fix when individual towers are handling fewer modems.  This is a pay-per-use solution if you make more than a certain number of queries in a 24 hour period and the count goes against your API key so it applies to all devices in the field, not just one.  As of 2014 Google charges between $10K-20$K annually for the business license and still limits the number of queries to around 100k.  Usually it works pretty well, but there are circumstances where it is simply wrong.  Remember – the accuracy relies on Google having the correct latitude/longitude of every base station in the US.  This is more prone to error than you might think.  Another weakness is that geography can really fowl things up.  Let’s say your device is traveling  up a hill that overlooks a valley.  At the bottom of the hill the modem may be connected to a tower close by, but let’s say that tower is obscured by a some small hills and trees.  As you climb the hill you get line of site to a tower on the other side of the valley and the modem is handed off to that tower.  Now the modem is connected to a tower miles away from the tower that is actually closest and you get an incorrect fix without even knowing it.

Can I use HTML5 Geolocation for mobile tracking? Yes, with caveats. Typically HTML5 tracking applications are built inside a native wrapper framework such as PhoneGap or Titanium. There are several immediate problems with stand-alone, browser-only HTML5 tracking applications. First, there is no built-in functionality to keep the screen from going to sleep. Second, when the screen goes to sleep the HTML5 Geolocation functionality also goes to sleep. Native-based tracking applications can work around these limitations and listen passively in the background when they are minimized. Third, you have little control over the GPS settings to help management battery consumption.

```js
// How to generate random locations nearby my location?
var r = 100/111300 // = 100 meters
  , y0 = original_lat
  , x0 = original_lng
  , u = Math.random()
  , v = Math.random()
  , w = r * Math.sqrt(u)
  , t = 2 * Math.PI * v
  , x = w * Math.cos(t)
  , y1 = w * Math.sin(t)
  , x1 = x / Math.cos(y0)

newY = y0 + y1
newX = x0 + x1
```

## GeoLocation API

The Geolocation API is a high-level client-side API that returns a users longitude and latitude using the best available location information source (GPS, cell IDs, RFID, MAC address, Wi-Fi, bluetooth, or IP address). Here’s some code to get a users location:

```js
try {
    if (navigator.geolocation) {
        /*
            getCurrentPosition takes up to three arguments:
                a successCallback
                a errorCallback (optional)
                PositionOptions (optional)

            PositionOptions is an object with three properties:
                enableHighAccuracy (boolean - default is false
                                    if true, response times may be slowed
                                    and battery consumption (on mobiles) may
                                    increase)
                timeout (in ms - default is infinity)
                maximumAge (in ms - default is 0
                            if > 0, the API tries to fetch a cached position)
        */
        navigator.geolocation.getCurrentPosition (function(position){
            /*
                the position object contains a 'coords' and 'timestamp' object;
                coords contains:
                    latitude
                    longitude
                    accuracy (in metres with 95% confidence)
                    altitude (in metres)
                    altitudeAccuracy (in metres)
                    heading (degrees clockwise relative to true north)
                    speed (in m/s - more relevant for the watchPosition function
                           which is not described here)
            */
        },
        function(error){
            /*
                The error object has a 'code' and 'message' property
                error.code can be:
                    1 (permission denied),
                    2 (position unavailable),
                    3 (timeout)
            */
        }
    } else {
        /* browser doesn't support geolocation */
    }
} catch (e) {
 /* error handling here */
}
```

Error Handling
Several errors need to be handled when using the geolocation API.

A permission denied error (error code 1) may occur if the user denies the location lookup request. Note that this error will also be triggered if the user chooses ‘always deny’ on an alternate website making a geolocation request.

A position unavailable error (error code 2) may occur if the call to navigator.getCurrentPosition() fails. I was able to trigger this error on my phone by disabling Google Location Services.

Finally, the timeout error (error code 3) will occur if PositionOptions.timeout (if set) is exceeded.


Accuracy

I experimented with the geolocation API on a few different browsers and devices. On my laptop, Chrome, Firefox, and Safari gave comparable results with an accuracy within 20 meters. IE, on the other hand, seemed to be be off by about 1.6 km. I was able to get down to within 5 meters on my cell phone (Galaxy Nexus) with GPS enabled.




## Calculate the distance between two GeoLocation

http://www.movable-type.co.uk/scripts/latlong.html
http://mobiforge.com/design-development/geo-sorting-using-device-geolocation-to-sort-distance
http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
http://stackoverflow.com/questions/13840516/how-to-find-my-distance-to-a-known-location-in-javascript
http://blog.dynamicprogrammer.com/2014/05/23/calculate-distance-with-geolocation-and-PhoneGap-part-9.html
https://www.google.com/search?q=distance+between+two+coordinates
