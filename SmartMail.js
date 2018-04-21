var letters = document.getElementsByClassName("b-datalist__item");

function makeHttpObject() {
  try {
    return new XMLHttpRequest();
  } catch (error) {}
  try {
    return new ActiveXObject("Msxml2.XMLHTTP");
  } catch (error) {}
  try {
    return new ActiveXObject("Microsoft.XMLHTTP");
  } catch (error) {}

  throw new Error("Could not create HTTP request object.");
}

for (var i = 0; i < letters.length; i++) {
  var request = makeHttpObject();
  request.open("GET", letters[i].childNodes[0].childNodes[0].href, true);
  request.send(null);
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      alert(request.responseText);
    }
  };
}
