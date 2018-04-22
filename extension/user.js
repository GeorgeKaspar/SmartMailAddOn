const SERVICE_URL = 'https://3bfaf6e6.ngrok.io/process'
const MAIL_THREAD_URL = 'https://e.mail.ru/api/v1/threads/thread?ajax_call=1&tarball=e.mail.ru-f-alpha-mail-64117-v.demidov-1523618897.tgz&offset=0&limit=50&htmlencoded=false&cache=false&api=1'

const fetchMessage = async (msg, token) => {
  const url = new URL(MAIL_THREAD_URL)
  url.searchParams.set('token', token)
  url.searchParams.set('id', msg.id)
  url.searchParams.set('ajax_call', '1')
  const email = document.getElementsByClassName('x-ph__menu__button__text x-ph__menu__button__text_auth')[0].innerHTML
  url.searchParams.set('email', email)
  url.searchParams.set('x-email', email)
  const res = await fetch(url, {credentials: 'include'})
  return res.json()
}

const rankMessages = async () => {
  const token = document.querySelector('html').outerHTML.match(/patron\.updateToken\("(.*)"\)/)[1]

  document.querySelector('#b-letters').style.opacity = '0.5'

  const messages = []
  for (let elem of document.getElementsByClassName('js-href b-datalist__item__link')) {
    const id = elem.href.split('/')[4]
    if (new Set(document.querySelector(`.b-datalist__item[data-id="${id}"]`).classList.values()).has('b-datalist__item_unread')) {
      messages.push({
        id: id,
        elem: elem
      })
    }
  }

  const bodies = await Promise.all(messages.map(msg => fetchMessage(msg, token)))
  bodies.forEach((body, i) => {
    messages[i].body = body.body.messages[0].body.text
  })
  console.log('Messages:')
  console.log(messages)

  const requestData = {messages: {}}
  messages.forEach(msg => {
    requestData.messages[msg.id] = msg.body
  })

  console.log('Request data')
  console.log(requestData)

  const response = await (await fetch(SERVICE_URL, {
    body: JSON.stringify(requestData),
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    mode: 'cors'
  })).json()
  const results = response['results']
  console.log('Results')
  console.log(results)


  const nodes = []

  for (let item of results) {
    const id = item.url
    const node = document.querySelector(`.b-datalist__item[data-id="${id}"]`)
    const elementHTML = '<div style="border: 1px solid #FDA840; color: black !important; font-weight: normal !important; padding-left: .5em; padding-right: .5em; background-color: #fffce1; max-height: 2.5em; overflow: hidden !important; resize: none !important; text-overflow: ellipsis !important; white-space: nowrap !important;">' + item.message + '</div>'
    node.querySelector('.b-datalist__item__wrapper').innerHTML += elementHTML
    node.querySelector('.b-datalist__item__body').style.height = '6em'

    nodes.push(node)
    node.remove()
  }

  for (let node of nodes) {
    if (new Set(node.classList.values()).has('b-datalist__item_unread')) {
      document.querySelector('.b-datalist__body').insertBefore(node, document.querySelector('.b-datalist__body').childNodes[0])
    }
  }

  document.querySelector('#b-letters').style.opacity = ''

  for (let i of document.getElementsByClassName('js-href b-datalist__item__link')) {
    (() => {
      i.onclick = () => {
        window.open(i.href)
        i.remove()
        // document.querySelector('.b-datalist__body').insertBefore(i,
        //   document.querySelector('.b-datalist__item .b-datalist__item_unread'))
        return false
    }})()
  }
}

(() => {
  window.onload = () => {
    const toolbar = document.querySelector('.b-toolbar__group[data-bem=b-radiobuttons]')
    toolbar.innerHTML += '<div id="important-btn" title="Важные" class="b-toolbar__btn b-toolbar__btn_grouped" style="font-size:1.5em;">😸</div>'
    const button = document.querySelector('#important-btn')
    button.onclick = () => {
      rankMessages()
        .then(() => console.log('success'))
        .catch(e => console.log('fail', e))
    }
  }
})()
