{
	const exid = chrome.runtime.id
	const elid = exid + "-script"

	if(!document.getElementById(elid)) {

    const jsframe = document.createElement('script')
    jsframe.src = chrome.runtime.getURL('jsframe/jsframe.min.js')
    document.head.append(jsframe)

    const content = document.createElement("script")
    content.id = elid
    content.src = chrome.runtime.getURL("js/content.js")
    content.type = "module"
    document.head.append(content)
  }
}