const SERVICE_URL = 'https://d3bdc870.ngrok.io/process'

const fetchMessage = async (msg) => {
  const url = new URL('https://e.mail.ru/api/v1/threads/thread?ajax_call=1&tarball=e.mail.ru-f-alpha-mail-64117-v.demidov-1523618897.tgz&tab-time=1524320652&offset=0&limit=50&htmlencoded=false&cache=false&api=1')
  url.searchParams.set('token', window.mailru_api_token)
  url.searchParams.set('id', msg.id)
  url.searchParams.set('ajax_call', '1')
  const email = document.getElementsByClassName('x-ph__menu__button__text x-ph__menu__button__text_auth')[0].innerHTML
  url.searchParams.set('email', email)
  url.searchParams.set('x-email', email)
  const res = await fetch(url, {credentials: 'include'})
  return res.json()
}

const rankMessages = async () => {
  alert(window.mailru_api_token) // shouln't be undefined!!! FIXME

  const messages = []
  for (let elem of document.getElementsByClassName('js-href b-datalist__item__link')) {
    messages.push({
      id: elem.href.split('/')[4],
      elem: elem
    })
  }

  const bodies = await Promise.all(messages.map(fetchMessage))
  bodies.forEach((body, i) => {
    window.console.log(body)
    messages[i].body = body.body.messages[0].body.text
  })
  console.log('Messages:')

  const requestData = {messages: {}}
  messages.forEach(msg => {
    requestData[msg.id] = msg.body
  })

  const response = (await fetch(SERVICE_URL, {
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
