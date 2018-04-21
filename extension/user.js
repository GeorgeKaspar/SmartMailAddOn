const SERVICE_URL = 'https://d3bdc870.ngrok.io/process'

const rankMessages = async () => {
    const messages = []
    for (let elem of document.getElementsByClassName('js-href b-datalist__item__link')) {
        messages.push({
            id: elem.href.split('/')[4],
            elem: elem
        })
    }
    const url = new URL('https://e.mail.ru/api/v1/threads/thread?ajax_call=1&tarball=e.mail.ru-f-alpha-mail-64117-v.demidov-1523618897.tgz&tab-time=1524320652&offset=0&limit=50&htmlencoded=false&cache=false&api=1')
    url.searchParams.set('token', window.mailru_api_token)
    url.searchParams.set('id', '1:6af09e91c67e1b1c:0')
    url.searchParams.set('ajax_call', '1')
    url.searchParams.set('email', 'smarthacktest2018@mail.ru')
    url.searchParams.set('x-email', 'smarthacktest2018%40mail.ru')

    const bodies = await Promise.all(messages.map(async msg => (await fetch(url, {credentials: 'same-origin'})).json()))
    bodies.forEach((body, i) => {
        messages[i].body = body.body.messages[0].body.text
    })
    console.log('Messages:')
    console.log(messages)

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
