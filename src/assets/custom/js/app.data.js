var Data = (function($) {
	// Variable definitions
	var $dom = {};
	var settings = {
			data: {
				url: '/assets/data/data.json'
			}
		};
	var list = {
		results: [],
		favorites: [],
		user_created: []
	};

	// Module init method
	function init() {
		_cacheDomElements();
		_loadData();
		_addEventListeners();
	}

	// Event listeners for creating items, searching and marking item as favorite
	function _addEventListeners() {
		$dom.create.on('submit', _onCreateFormSubmit);
		$dom.search.on('submit', _onSearchFormSubmit);
		$dom.list.on('click', '.heart', _onFavoriteClick);
		$dom.user_created.on('click', '.delete', onUserCreatedDelete);
	}

	// Caching DOM elements for future usage
	function _cacheDomElements() {
		$dom.today = $('#today');
		$dom.list = $('.list');
		$dom.today_list = $('#today ul');
		$dom.favorites = $('#favorites');
		$dom.favorites_list = $('#favorites ul');
		$dom.users = $('#created-by-you ul');
		$dom.create = $('#create form');
		$dom.user_created = $('#created-by-you ul');
		$dom.search = $('#search form');
		$dom.search_term = $('#search #search-term');
		$dom.search_results = $('#search-results');
		$dom.search_results_no_items = $('#search-results .no-items-found');
		$dom.search_results_list = $('#search-results ul');
		$dom.search_items_found = $('#search-items-found');
		$dom.search_term_value = $('#search-term-value');
	}

	// Filter data based on search term
	function _filterDataByTerm(obj) {
		var term = $dom.search_term.val();

		return obj.category.indexOf(term) > -1;
	}

	// Get template for list items
	function _getDataTemplate(item, favorite) {
		favorite = favorite || false;
 		return '<li class="box__list__item">' +
				'<img class="box__list__item__image" src="/assets/img/data/' + item.image + '" />' +
		    '<h2 class="box__list__item__title">' + item.title + '</h2>' +
		    '<p class="box__list__item__content">' + item.description + '</p>' +
		    '<a class="heart fa fa-heart ' + (favorite ? 'active' : '') + '" data-id="' + item.id + '"></a>' +
			'</li>';
	}

	// Get template for user list items
	function _getUserCreatedDataTemplate(item) {
 		return '<li class="box__list__item">' +
			// '<img class="box__list__item__image" src="/assets/img/data/' + item.image + '" />' +
				'<div class="box__list__item__image fa fa-user"></div>' +
		    '<h2 class="box__list__item__title">' + item.title + '</h2>' +
		    '<p class="box__list__item__content">' + item.description + '</p>' +
		    '<a class="delete fa fa-close"></a>' +
			'</li>';
	}

	// Load data from JSON
	function _loadData() {
		$.getJSON(settings.data.url, _onLoadData);
	}

	// Load favorites from Local Storage
	function _loadFavorites() {
		var html = '';

		list.favorites = JSON.parse(localStorage.getItem('favorites')) || [];

		$('[data-id]').removeClass('active');

		for (var favorite in list.favorites) {
			$('[data-id=' + list.favorites[favorite] + ']').addClass('active');
			html += _getDataTemplate(list.results[list.favorites[favorite]], true);
		}

		$dom.favorites_list.html(html);

		if (!list.favorites.length) {
			$dom.favorites_list.html('<li class="box__list__item">No favorites found</li>');
		}
	}

	// Load items created by users from Local Storage
	function _loadUserCreated() {
		var html = '';

		list.user_created = JSON.parse(localStorage.getItem('user_created')) || [];

		for (var item in list.user_created) {
			html += _getUserCreatedDataTemplate(list.user_created[item]);
		}

		$dom.user_created.html(html);

		if (!list.user_created.length) {
			$dom.user_created.html('<li class="box__list__item">No items created by you</li>');
		}
	}

	// EVENTS:
	// Create item
	function _onCreateFormSubmit(e) {
		e.preventDefault();

		var $name = $('#name');
		var $description = $('#description');

		list.user_created.push({
			title: $name.val(),
			description: $description.val(),
		});

		localStorage.setItem('user_created', JSON.stringify(list.user_created));

		$name.val('');
		$description.val('');

		_loadUserCreated();
	}

	// Load Data success handler
	function _onLoadData(data) {
		var item,
			results = '';

		for (item in data) {
			results += _getDataTemplate(data[item]);
			list.results[data[item].id] = data[item];
		}

		$dom.today_list.html(results);

		_loadFavorites();
		_loadUserCreated();
	}

	// Search form submit handler
	function _onSearchFormSubmit(e) {
		alert('oi');

		e.preventDefault();

		var search_results = list.results.filter(_filterDataByTerm),
			term = $dom.search_term.val(),
			html = '';

		$dom.search_items_found.html(search_results.length);
		$dom.search_term_value.html(term);

		for (var result in search_results) {
			html += _getDataTemplate(search_results[result]);
		}

		$dom.today.addClass('hidden');
		$dom.search_results.removeClass('hidden');
		$dom.search_results_list.html(html);

		if (!search_results.length) {
			$dom.search_results_no_items.removeClass('hidden');
		} else {
			$dom.search_results_no_items.addClass('hidden');
		}
	}

	// Favorite link click handler
	function _onFavoriteClick(e) {
		e.preventDefault();

		var $this = $(this),
			id = $this.data('id'),
			index = list.favorites.indexOf(id);

		if (index == -1) {
			list.favorites.push(id);
			$this.addClass('active');
		} else {
			list.favorites.splice(index, 1);
			$this.removeClass('active');
		}

		localStorage.setItem('favorites', JSON.stringify(list.favorites));

		_loadFavorites();
	}

	function onUserCreatedDelete(e) {
		e.preventDefault();

		var $this = $(this),
			index = $this.parent().index();

		list.user_created.splice(index, 1);

		localStorage.setItem('user_created', JSON.stringify(list.user_created));

		_loadUserCreated();
	}

	return {
		init: init
	};
})(window.jQuery);
