{
	const exid = chrome.runtime.id
	const elid = exid + "-script"

	if(!document.getElementById(elid)) {
    const scr = document.createElement("script")
    scr.id = elid
    scr.src = chrome.runtime.getURL("js/content.js")
    scr.type = "module"
    document.head.append(scr)
  }
}