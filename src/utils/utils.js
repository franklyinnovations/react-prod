import moment from 'moment';

function changeDateFormat(date) {
  return moment(date).format('DD-MM-YYYY');
}

function showMessage(type,msg){

  Messenger(
    {
      //extraClasses: 'messenger-fixed messenger-on-right messenger-on-top'
    }).post({
      message: msg,
      singleton: false,
      id: 'neo',
      hideAfter: 10,
      type: type,
      showCloseButton: true
    });
    
  }


  module.exports = {
    changeDateFormat,
    showMessage
  };
