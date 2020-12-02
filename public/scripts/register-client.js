// Register Page


// Vanilla JS, formats the phone number on register page
const formatTel = () => {
  let phoneNum = document.getElementById("phone");

  if (phoneNum.value.length < 10) {
    alert("not enough chars")
  } else if (phoneNum.value.length > 14) {
    alert("too many chars");
  } else if (phoneNum.value.length > 9 && phoneNum.value.length < 15) {
    phoneNum.value = phoneNum.value.replace(/[^0-9]/g, '');
    phoneNum.value = phoneNum.value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
};
