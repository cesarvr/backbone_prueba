(function(){
	console.log('hello world');
	var ROOT = 'http://localhost:3000/collections'


	var save_model = function(model){
		model.save({ success: function(model){
			console.log('id->', model.id);
		}});
	}

	var Modelo = Backbone.Model.extend({
	  idAttribute: '_id',
	    parse : function(resp, xhr) {
	    	if(resp && typeof resp.push === 'function'){
	    		return resp[0];
	    	}
  			return resp;
  		},
	});

	var Collection = Backbone.Collection.extend({
	 model: Modelo,
	 url: ROOT + '/test'
	});

	var collection = new Collection();
	$('#')



	
	
	function save(){
		var model1 = new Modelo({title:'onePlus', model:'One', chip:'SnapDragon'});	
		var model2 = new Modelo({title:'Samsung', model:'Galaxy', chip:'M4 Cortex'});
		save_model(model1);
		save_model(model2);
	}

	function save_special(){
		var m = collection.get('54e8d4326908e6600f7fc305');
		console.log('id->', m.id);
		console.log('title->', m.get('title'));	
	}


	function fancyReset(myCollection){
		console.log('fancyReset', myCollection);
		myCollection.each(function(m){
			console.log('id->', m.id);
			console.log('title->', m.get('title'));
		});
	}

	

	function fetch(){
		
		collection.on('reset', fancyReset);	
		collection.fetch({
			reset: true, 
			success: function(){
    		console.log(collection.models); // => 2 (collection have been populated)
		}});


		console.log(collection.length);
	}



	var Cell = Backbone.View.extend({
		tagName: 'li',
		className: 'view-cell',
		events: {
			'click a' :'update'
		},

		initialize: function(){
			this.cell = document.createElement('a');
		},
		update: function(){
			console.log('yeah');
			this.model.trigger('m:modify', this.model);
		},

		update_cell: function(){
			this.$(this.cell).html('id-> '+this.model.id + ' name-> '+this.model.get('title')+ ' model-> '+this.model.get('model')+ ' chip-> '+this.model.get('chip') )
			return this;	
		},

		render:function(){
			this.$el.append(this.cell);
			this.$(this.cell).html('<a>'+ 'id-> '+this.model.id + ' name-> '+this.model.get('title')+ ' model-> '+this.model.get('model')+ ' chip-> '+this.model.get('chip') + '</a>' )	
			return this;
		}
	});

	var Home = Backbone.View.extend({
		el:'#panel', 
		model_to_update: null,
		events: {
			'click #save': 'save',
			'click #refresh' :"refresh",
		},


		initialize:function(){
			//collection.on('reset', this.handle_reset);	
			collection.fetch({reset:true}); // => 2 (collection have been populated)

			this.listenTo(collection, 'reset', this.handle_reset);
			this.listenTo(collection, 'add', this.list_add);
			this.listenTo(collection, 'change', this.cell_update);
			collection.on('m:modify', this.update);
			this.model = null; 
		},

		update: function(m){	
			window.model_to_update = m;
			$('#title').val(m.get('title'));
			$('#chip').val(m.get('chip'));
			$('#model').val(m.get('model'));
		},

		save: function(){
			var that = this;
			if(window.model_to_update){
				var m =window.model_to_update;
				var hash = {};
				hash['title'] = $('#title').val(); 
				hash['chip'] = $('#chip').val(); 
				hash['model'] = $('#model').val(); 
				m.save(hash,{wait:true, patch:true});
			}else{

				collection.create(
					{'title': $('#title').val(),  
				 	 'chip': $('#chip').val(),
				 	 'model': $('#model').val() },
				 	 {wait:true,
				 	  success:function(m){
				 	  	console.log('success');
				 	  	//that.list_add(m);
				 	  },
				 	  error: function(){
						console.log('error');
				 	  }
				 	});
			}

		},

		refresh: function(){
			collection.fetch();
		},	

		render: function(){
			
		},

		cell_update: function(){
			for(var i in this.cell_view)
				 $('#list').append(this.cell_view[i].update_cell().el);
		},

		list_add: function(m){
			var cell = new Cell({model:m});
			$('#list').append(cell.render().el);
			this.cell_view.push(cell)
		},

		handle_reset: function(c){
			var that = this;
			this.cell_view= [];
			c.each(function(m){
				that.list_add(m);
			});
			
			
		},


	});


	var h = new Home();
	h.render();
	
	//fetch();
	//save_special();

	
	//debugger;

})();