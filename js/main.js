
const generalContact = document.getElementById("generalContact");

generalContact.addEventListener("submit", function (event) {
    event.preventDefault();


    const name = document.getElementById("nameContact").value;
  
    const company = document.getElementById("companyNameContact").value;

    const type = document.getElementById("selectTypeFeedback").value;
    
    const email = document.getElementById("emailContact").value;
  
    const phone = document.getElementById("phoneNumberContact").value;

    const message = document.getElementById("messageContact").value;

    console.log({ name, company,type,email,phone,message })
    generalContact.reset();
});

  document.addEventListener('DOMContentLoaded', function () {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  })