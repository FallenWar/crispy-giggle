(function ($) {
  var imkt = window.imkt || (window.imkt = {});
  imkt.utils = imkt.utils || {};
  imkt.software = imkt.software || {};

  imkt.software.Sourcetree = function(domRoot, params){
    this.init();
  };

  imkt.software.Sourcetree.prototype = {
    init: function(){
      if ($('body').hasClass('edit')) {
        return;
      }

      this.bindEvents();
    },
    bindEvents: function() {
      var self = this;

      $(document).ready(function() {
        self.$buttonPrimary = $(".product-tour-hero--video__button .button");
        self.$buttonSecondary = $(".product-tour-hero--video__link--secondary .cms-link");

        self.downloadUrlMac = self.$buttonPrimary.attr("href");
        self.downloadUrlWindows = self.$buttonSecondary.attr("href");

        self.textMac = self.$buttonPrimary.text().split(" for ");
        self.textWindows = self.$buttonSecondary.text().split(" for ");

        if (self.textMac.length > 1) {
          self.textMac = self.textMac[1];
        } else {
          self.textMac = "Mac OS X";
        }

        if (self.textWindows.length > 1) {
          self.textWindows = self.textWindows[1];
        } else {
          self.textWindows = "Windows";
        }

        // Safely get browser lib
        imkt.utils.browser = imkt.utils.browser || {};

        if (imkt.utils.browser.isWindows()) {
          self.swapDownloadLinks();
        }
      });
    },
    swapDownloadLinks: function() {
     // Swap href and text
      var tempPrimaryText = this.$buttonPrimary.text();
      var tempSecondaryText = this.$buttonSecondary.text();

      this.$buttonPrimary.attr("href", this.downloadUrlWindows).text(tempPrimaryText.replace(this.textMac, this.textWindows));
      this.$buttonSecondary.attr("href", this.downloadUrlMac).text(tempSecondaryText.replace(this.textWindows, this.textMac));

      // Swap below the fold section
      $(".button--primary-download").attr("href", this.downloadUrlWindows).text(tempPrimaryText.replace(this.textMac, this.textWindows));
      $(".button--secondary-download").attr("href", this.downloadUrlMac).text(tempSecondaryText.replace(this.textWindows, this.textMac));

      // Swap subnav link
      $(".subnavigation--product .button").attr("href", this.downloadUrlWindows);
    }


  };

  var SourcetreeJs = new imkt.software.Sourcetree();

})(jQuery);
