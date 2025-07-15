//form general contact
document.getElementById("generalContact").addEventListener("submit",function(event){
    event.preventDefault()

    const name = document.getElementById("name").value;
    const companyName = document.getElementById("companyName").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const message = document.getElementById("message").value;

    console.log({
        name,
        companyName,
        email,
        phoneNumber,
        message
    })
 
})
