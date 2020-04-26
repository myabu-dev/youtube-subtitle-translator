const TIMEOUT_DULATION = 300;
const CLONE_CAPTION_WINDOW_ID = 'extension-clone-caption-window'
const ENG_WORD_SPAN_CLASS = 'extension-word-span'

const WHITLIST_CHARS = [
  "'", "’", '.'
]

function isAlphabetOrNum(str){
  if(str){
    return /^[A-Za-z0-9]*$/.test(str)
  }else{
    return false
  }
}

window.setTimeout(setTitleObserver, TIMEOUT_DULATION)


function setTitleObserver(){
  console.log('observer')
  const title = document.querySelector('title')
  
  if(title == null){
    window.setTimeout(setTitleObserver, TIMEOUT_DULATION)
    return
  }

  titleObserver.observe(title,{
    subtree: true, characterData: true, childList: true
  })
}

const titleObserver = new MutationObserver( () => {
  captionObserver.disconnect()
  console.log('title change')
  removeCloneCaption()
  setCaptionObserver()
})



function setCaptionObserver(){
  const captionWindow = document.querySelector('div[id*="caption-window"]')
  if(captionWindow === null) {
    window.setTimeout(setCaptionObserver, TIMEOUT_DULATION)
    return
  }

  if(captionWindow.getAttribute('draggable') !== 'true'){
    console.log('not drag')
    window.setTimeout(setCaptionObserver, TIMEOUT_DULATION)
    return
  }

  captionObserver.observe(captionWindow.parentElement.parentElement, {
    childList: true,
    subtree: true,
    textContent: true
  })
}




function removeCloneCaption(){
  const clone = document.getElementById(CLONE_CAPTION_WINDOW_ID)
  if(clone){
    clone.remove()
  }
}

function addCloneCaption(original){
  if(!original) return

  const clone = original.cloneNode(true)
  clone.id = CLONE_CAPTION_WINDOW_ID
  original.parentElement.appendChild(clone)
}

function getCloneCaption(){
  return document.getElementById(CLONE_CAPTION_WINDOW_ID)
}

function aaaaaaaa(str){
  console.log('clicked: '+str)
}

const captionObserver = new MutationObserver( () => {
  removeCloneCaption()

  let captionWindow = document.querySelectorAll('div[id*="caption-window"][draggable="true"]')
  if(captionWindow.length === 0){
    console.log('none')
    return;
  }

  // for(const line of captionWindow){
  //   if(line.getAttribute('lang') && line.getAttribute('draggable') === 'true'){
  //     console.log('auto generated')
  //     return
  //   }
  // }

  captionObserver.disconnect();

  if(captionWindow.length > 1){
    captionWindow[0].remove()
    captionWindow = captionWindow[1]
  }else{
    captionWindow = captionWindow[0]
  }



  captionWindow.style.display = 'block'

  addCloneCaption(captionWindow)

  captionWindow.style.display = 'none'


  const captionList = getCloneCaption().querySelectorAll('span > span > span')
  for(const line of captionList){
    const text = line.textContent
    if(text === null)continue;

    line.innerHTML = null
    // const separator = /(?<=\s+|\W|_)/ //split with sepalator char
    const separator = /([^a-zA-Z_0-9\.\’\']+|\.\.\.|\.\.|'')/
    wordList = text.split(separator)
    console.log(wordList)
    let newInnerHTML = ''
    for(const word of wordList){
      let validWord = ''
      let colonCounter = 0
      for(const char of word){
        if(isAlphabetOrNum(char) || WHITLIST_CHARS.includes(char)){
          validWord += char
          if(char === '.'){
            colonCounter ++
          }
        }
      }

      if(validWord[validWord.length-1] === '.'){
        validWord = validWord.slice(0, -1)
      }
      
      console.log(validWord)
      const wordSpanElm = document.createElement('span')
      wordSpanElm.innerHTML = validWord
      wordSpanElm.style.color = 'red'
      wordSpanElm.className = ENG_WORD_SPAN_CLASS
      // wordSpanElm.style.textDecoration = 'underline'
      const replaced = wordSpanElm.outerHTML
      if(word.length === colonCounter){
        newInnerHTML += word
      }else{
        newInnerHTML += word.replace(validWord, replaced)
      }
    }
    line.innerHTML = newInnerHTML
  }

  const spanList = document.querySelectorAll('.'+ENG_WORD_SPAN_CLASS)
  for(const span of spanList){
    span.onclick = ()=>{aaaaaaaa(span.textContent.replace("’","'"))}
  }


  const captionContent = document.querySelectorAll('div[id*="caption-window"][draggable="true"] span span span')

  captionObserver.observe(captionWindow.parentElement.parentElement, {
    childList: true,
    subtree: true,
    textContent: true
  })

  // console.log(captionContent)
  // for(const line of captionContent){
  //   if(line.textContent === null) continue;
  //   console.log(line.textContent)
  // }


})

