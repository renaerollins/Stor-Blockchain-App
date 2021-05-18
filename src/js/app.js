App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    $.getJSON('../products.json', function(data) {
      var productsRow = $('#productsRow');
      var productTemplate = $('#productTemplate');

      for (i = 0; i < data.length; i ++) {
        productTemplate.find('.panel-title').text(data[i].name);
        productTemplate.find('img').attr('src', data[i].picture);
        productTemplate.find('.product-size').text(data[i].size);
        productTemplate.find('.product-brand').text(data[i].brand);
        productTemplate.find('.product-price').text(data[i].price);
        productTemplate.find('.btn-buy').attr('data-id', data[i].id);

        productsRow.append(productTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {

        await window.ethereum.enable();
      } catch (error) {
        console.log('User denied account access')
      }
    }

    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }

    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Store.json', function(data) {

      var StoreArtifact = data;
      App.contracts.Store = TruffleContract(StoreArtifact);

      App.contracts.Store.setProvider(App.web3Provider);

      return App.markBrought();
    })

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleBuy);
  },

  markBrought: function(buyers, account) {
    var storeInstance;

    App.contracts.Store.deployed().then(function(instance) {
      storeInstance = instance;

      return storeInstance.getBuyers.call();
    }).then(function(buyers) {
      for (i = 0; i < buyers.length; i++) {
        if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
      $('.panel-product').eq(i).find('button').text('Success').attr('disabled', true);
      }
     }
    }).catch(function(err) {
      console.log(err.message);
    })
  },

  handleBuy: function(event) {
    event.preventDefault();

    var productId = parseInt($(event.target).data('id'));

    var storeInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Store.deployed().then(function(instance) {
        storeInstance = instance;

        return storeInstance.buy(productId, {from: account});
      }).then(function(result) {
        return App.markBrought();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
