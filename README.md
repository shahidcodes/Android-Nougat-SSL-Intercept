# Android Nougat SSL Intercept

In Android 7.0, Google introduced changes to the way user Certificate Authorities (CA) are trusted. These changes prevent third-parties from listening to network requests coming out of the application:
More info: 
1) https://developer.android.com/training/articles/security-config.html
2) http://android-developers.blogspot.com/2016/07/changes-to-trusted-certificate.html

This script injects network security exceptions into the APK that allow third-party software like Charles Proxy/Fiddler to listen to the network requests and responses of some Android applications.


## Getting Started

1. Clone the repository.
2. In repo directory run `npm install`

### Prerequisites
1. Node >= 6.9.*
2. JRE (to run apktool)

## Usage
``` 
	$ node addSecurityException.js /path/to/apk /path/to/keystore keystorePass
```
### Examples

```
uses default keystore
	$ node addSecurityException.js myApp.apk 

with your keystore
	$ node addSecurityException.js myApp.apk finalKey.jks android

```

### Alternatives
- https://github.com/shroudedcode/apk-mitm
- https://bird.ac/injecting-mitm-proxy-on-compiled-android-apk/
