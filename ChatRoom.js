function ChatRoom() {
  var latitude;
  var longitude;
  var size;
  var name;
  var description;
  var genre;

  this.setName = function(str){
    name = str;
  }

  this.setDesc = function(desc){
    description = desc;
  }

  this.setGenre = function(gen){
    genre = gen;
  }

  this.getSize = function(){
    return size;
  }

  this.isEmpty = function(){
    return (size === 0);
  }

  this.getLat = function(){
    return latitude;
  }

  this.getLong = function(){
    return longitude;
  }

}
