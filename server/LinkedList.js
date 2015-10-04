var LinkedList = function(){
  var list = {};
  list.head = null;
  list.tail = null;
  list.length = 0;

  list.addToTail = function(value) {
    list.length++;
    var newNode = Node(value);
    if(!list.head) {
      list.head = newNode;
      list.tail = list.head;
    } else {
      (list.tail).next = newNode;
      list.tail = (list.tail).next;
    }
  };

  list.removeHead = function() {
    list.length--;
    var result = list.head;
    if (!result) {
      return;
    } else {
      list.head = (list.head).next;
      return result.value;
    }
  };

  list.contains = function(target){
    var ret = false;
    var res = list.head;
    while(res !== null) {
      if(res.value === target) {
        ret = true;
        break;
      }
      res = res.next;
    }
    return ret;
  };

  return list;
};

var Node = function(value){
  var node = {};

  node.value = value;
  node.next = null;

  return node;
};
module.exports = LinkedList;