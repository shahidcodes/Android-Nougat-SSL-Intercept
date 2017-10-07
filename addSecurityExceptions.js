

const exec = require("child_process").exec,
	  fs = require("fs"),
	  path = require("path"),
	  mkdirp = require("mkdirp");
const scriptPath = __dirname
const apkPath = process.argv[2];
const apkDirName = path.dirname(apkPath)
const sourceFolderName = __dirname + "/" + path.basename(apkPath.substr(0, apkPath.length-4)) 
let keyPath = process.argv[3];
if(keyPath == undefined){
	keyPath = "./finalKey.jks";
}
let keyPass = process.argv[4]
if(keyPass == undefined) keyPass="android"

function signAndAlign() {
	let newApkPath = sourceFolderName + "/dist/" + path.basename(apkPath);
	const signer = exec(`java -jar apksigner.jar sign --ks ${keyPath} --ks-pass pass:${keyPass} ${newApkPath}`)
	signer.stderr.on('data', data=>console.error(data));
	signer.on('exit', function(){
		console.log(`[+] Singed APK Under " + sourceFolderName + "/dist/${newApkPath}`);
	})
}

function prepareLaunch() {
	// make sure we have /res/xml folder
	let exists = mkdirp.sync(sourceFolderName+ "/res/xml")
	console.log("[+] XML foler exists: ", (exists==null));
	try{
		fs.writeFileSync(sourceFolderName + "/res/xml/network_security_config.xml", fs.readFileSync("network_security_config.xml"));
		console.log("[+] network_security_config file copied")
	}catch(err){
		console.error("[-] Can't copy network_security_config.xml to " + sourceFolderName + "/res/xml: ", err.message)
	}
	let manifestFile = fs.readFileSync(sourceFolderName + "/AndroidManifest.xml").toString();
	if(manifestFile.indexOf("android:networkSecurityConfig") == -1)
		manifestFile = manifestFile.replace("<application", '<application android:networkSecurityConfig="@xml/network_security_config" ');
	else
		console.log("[+] Dont know but manifest is already edited?")
	try{
		fs.writeFileSync(sourceFolderName + "/AndroidManifest.xml", manifestFile.toString());
		console.log("[+] Manifest Edited");
	}catch(err){
		console.error("[-] Error while editing manifest file");
	}

	const final = exec("java -jar apktool.jar b \"" + sourceFolderName +  '"');
	final.stderr.on('data', function(err){
		if(err) console.error(err)
	})
	final.on('exit', function () {
		console.log("[+] Apk Built Complete");
		signAndAlign();
	})
	final.stdout.on('data', function(data) {
	    console.log(data); 
	});

}
const child = exec("java -jar apktool.jar -f --no-src d \"" + apkPath + "\"");
child.stderr.on('data', function(err){
	if(err) console.error(err)
})
child.on('exit', function () {
	prepareLaunch()
})
child.stdout.on('data', function(data) {
    console.log("[+]" + data); 
});