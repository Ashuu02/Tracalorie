//Ashu's project    

//storage controller 

const StorageCtrl = (function(){
    // Public methods
    return {
      storeItem: function(item){
        let items;
        // Check if any items in ls
        if(localStorage.getItem('items') === null){
          items = [];
          // Push new item
          items.push(item);
          // Set ls
          localStorage.setItem('items', JSON.stringify(items));
        } else {
          // Get what is already in ls
          items = JSON.parse(localStorage.getItem('items'));
  
          // Push new item
          items.push(item);
  
          // Re set ls
          localStorage.setItem('items', JSON.stringify(items));
        }
      },
      getItemsFromStorage: function(){
        let items;
        if(localStorage.getItem('items') === null){
          items = [];
        } else {
          items = JSON.parse(localStorage.getItem('items'));
        }
        return items;
      },
      updateItemStorage: function(updatedItem){
        let items = JSON.parse(localStorage.getItem('items'));
  
        items.forEach(function(item, index){
          if(updatedItem.id === item.id){
            items.splice(index, 1, updatedItem);
          }
        });
        localStorage.setItem('items', JSON.stringify(items));
      },
      deleteItemFromStorage: function(id){
        let items = JSON.parse(localStorage.getItem('items'));
        
        items.forEach(function(item, index){
          if(id === item.id){
            items.splice(index, 1);
          }
        });
        localStorage.setItem('items', JSON.stringify(items));
      },
      clearItemsFromStorage: function(){
        localStorage.removeItem('items');
      }
    }
  })();


//Item controller 

const ItemCtrl = (function(){

    //Item constructor
    const Item = function(id,name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data structure 
    const data = {
        // items:[
        //     // {id: 0, name: 'Steak Dinner', calories: 1200},
        //     // {id: 1, name: 'Cookie', calories: 400},
        //     // {id: 2, name: 'Eggs', calories: 300}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    
    //Public methods
    return {
        getItems: function(){
            return data.items;
        },

        setCurrentItem(item){
            data.currentItem = item;
        },

        getCurrentItem: function(){
            return data.currentItem;
        },

        addItem : function(name,calories){
            let ID  ;
            if(data.items.length > 0 ){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }

            calories = parseInt(calories);  

            newItem = new Item(ID, name, calories);

            data.items.push(newItem);
            // console.log(data.items)
            return newItem;
        },

        updateItem:function(name,calories){

            calories = parseInt(calories);
            let found = null ;

            data.items.forEach(item => {
                if(item.id === data.currentItem.id){
                    item.name = name ;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },

        deleteItem:function(id){
            const ids = data.items.map(function(item){
                return item.id;
            });

            const index = ids.indexOf(id);
            data.items.splice(index,1) ;
        },

        clearAllItems: function(){
            data.items = [];
        },

        getTotalCalories: function(){
            let total = 0;
      
            // Loop through items and add cals
            data.items.forEach(function(item){
              total += item.calories;
            });
      
            // Set total cal in data structure
            data.totalCalories = total;
      
            // Return total
            return data.totalCalories;
          },

        getItemById:function(id){
            let found = null;
            data.items.forEach(item => {
                if(item.id === id){
                    found = item;
                } 
            });
            return found;
        },

        logData: function(){
            return data;
        }
        
    }
})();


//UI controller 
const UICtrl = (function(){

    const UIselectors ={
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    return{
        populateItemList:function(items){
            let html = '';
            items.forEach(function(item){
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class=" edit-item fa fa-pencil"></i>
                    </a>
                </li>
              `
            });
            document.querySelector(UIselectors.itemList).innerHTML = html;
        },

        updateListItem: function(item) {
            let listItems = document.querySelectorAll('#item-list li')

            //Turn node-list into an array 
            listItems = Array.from(listItems);

            listItems.forEach(listItem => {
                const itemId = listItem.getAttribute('id');

                if(itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML = `
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                        <i class=" edit-item fa fa-pencil"></i>
                        </a>`;
                }
            });
        },

        getItemInput:function(){
            return {
                name: document.querySelector(UIselectors.itemNameInput).value,
                calories: document.querySelector(UIselectors.itemCaloriesInput).value
            }
        },
        getSelectors:function(){
            return UIselectors;
        },


        addListItem:function(item){
            document.querySelector(UIselectors.itemList).style.display = 'block';

            const li = document.createElement('li');

            li.classList = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class=" edit-item fa fa-pencil"></i>
            </a>`

            document.querySelector(UIselectors.itemList).insertAdjacentElement('beforeend',li);
        },

        addItemToForm:function(){
            document.querySelector(UIselectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UIselectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        showEditState(){
            document.querySelector('.update-btn').style.display = 'inline';
            document.querySelector('.delete-btn').style.display = 'inline';
            document.querySelector('.back-btn').style.display = 'inline';
            document.querySelector('.add-btn').style.display = 'none';
        },

        hideList:function(){
            document.querySelector(UIselectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UIselectors.totalCalories).textContent = totalCalories;
          },

        clearInput:function(){
            document.querySelector(UIselectors.itemNameInput).value = '';
            document.querySelector(UIselectors.itemCaloriesInput).value = '';
        },
        clearEditState:function(){
            UICtrl.clearInput();
            document.querySelector('.update-btn').style.display = 'none';
            document.querySelector('.delete-btn').style.display = 'none';
            document.querySelector('.back-btn').style.display = 'none';
            document.querySelector('.add-btn').style.display = 'inline';
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UIselectors.listItems);
      
            // Turn Node list into array
            listItems = Array.from(listItems);
      
            listItems.forEach(function(item){
              item.remove();
            });
        },

        deleteFromUI: function(id){
            const item = document.querySelector(`#item-${id}`);
            item.remove();
        }
    }
  })();
  


//App controller 

const App = (function(ItemCtrl,StorageCtrl, UICtrl){

    //Load event listeners 
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();
        //add to list
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
 
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

        //Update button event
        document.querySelector('.update-btn').addEventListener('click',itemUpdateBtn);

        //Back button event
        document.querySelector('.back-btn').addEventListener('click', UICtrl.clearEditState);

        document.querySelector('.delete-btn').addEventListener('click', deleteSubmitBtn);
        
        // Clear All items event
        document.querySelector('.clear-btn').addEventListener('click', clearAllItemsClick);


        document.addEventListener('keypress',function(e){
            if(e.keycode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })
    }


    const itemAddSubmit = function(e){
        const input = UICtrl.getItemInput();

        if(input.name !== '' &&  input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name,input.calories);

            UICtrl.addListItem(newItem);

            const totalCalories = ItemCtrl.getTotalCalories();
             // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            StorageCtrl.storeItem(newItem);
            UICtrl.clearInput();
        }
        e.preventDefault();
    }

    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item'))   {        //edit-item class is not loaded with the website so we use event delegation we can't directly use that eddit-item class
            //get list-item id like item-0, item-1
            const listId = e.target.parentNode.parentNode.id;
            const listIdArr = listId.split('-');    // splits item-0(any number) into arr = [item, 0] or arr=[item,1]
            
            const itemToEdit = ItemCtrl.getItemById(parseInt(listIdArr[1]));

            //set current item to 
            ItemCtrl.setCurrentItem(itemToEdit)

            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    const itemUpdateBtn = function(e){
        const input = UICtrl.getItemInput();
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        
        UICtrl.clearInput();

        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    const deleteSubmitBtn=function(e){
        const input = ItemCtrl.getCurrentItem();

        //delte from data structure
        ItemCtrl.deleteItem(input.id);

        //delete from UI
        UICtrl.deleteFromUI(input.id);
        
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.clearInput();

        StorageCtrl.deleteItemFromStorage(input.id);

        UICtrl.clearEditState();
        
        e.preventDefault();
    }

    // Clear All items event
    const clearAllItemsClick = function(){
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Remove from UI
        UICtrl.removeItems();

        StorageCtrl.clearItemsFromStorage();

        // Hide UL
        UICtrl.hideList();
    
  }

    //Public methods
    return{
        init:function(){

            UICtrl.clearEditState();
            //fetch items from data structure
            const items = ItemCtrl.getItems();
            //check if items
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                //populate list with items
                UICtrl.populateItemList(items);
            }



            loadEventListeners();
        }
    }

})(ItemCtrl,StorageCtrl, UICtrl)


//initialize the app
App.init(); 


