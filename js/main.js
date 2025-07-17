
const generalContact = document.getElementById("generalContact");

generalContact.addEventListener("submit", function (event) {
    event.preventDefault();

    //nombre
    const name = document.getElementById("nameContact").value;
    //nombre de la empresa
    const companyName = document.getElementById("companyNameContact").value;
    //correo
    const email = document.getElementById("emailContact").value;
    //telefono
    const phoneNumber = document.getElementById("phoneNumberContact").value;
    //mensaje
    const message = document.getElementById("messageContact").value;

    console.log({
        name,
        companyName,
        email,
        phoneNumber,
        message
    });


    generalContact.reset();
});




const feedback = document.getElementById("feedback");

feedback.addEventListener("submit", function (event) {
    event.preventDefault();

    //nombre
    const name = document.getElementById("nameFeedback").value;
    //select
    const select = document.getElementById("selectTypeFeedback").value;
    //correo
    const email = document.getElementById("emailFeedback").value;
    //area
    const area = document.getElementById("selectAreaFeedback").value;
    //detalle
    const detail = document.getElementById("detailsFeedback").value;

    console.log({ name, select,email,area,detail })
    feedback.reset();
});