const loginsec=document.querySelector('.login-section')
const loginlink=document.querySelector('.login-link')
const registerlink=document.querySelector('.register-link')
loginlink.addEventListener('click',()=>{
        loginsec.classList.remove('active')
})
registerlink.addEventListener('click',()=>{
    loginsec.classList.add('active')
})