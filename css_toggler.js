function TOG_display(ElIdStr = "Name_modal") {
// take an element and toggle the css display property
// between "block" and "none"
    
  let ElId = document.getElementById(ElIdStr.toString());
    
    if (ElId.style.display == "none") {
        return ElId.style.display = "block";
    } else {
        return ElId.style.display = "none";
    }
    
}

//TOG_display();

const dss = {
    targetId: undefined,
    setTargetId: function(target) {
      return .targetId =  document.getElementById(target);  
    },
    display: function(param) {
        
    }
}

