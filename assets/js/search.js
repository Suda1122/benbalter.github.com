// Generated by CoffeeScript 1.6.3
(function() {
  var GitHubSearch,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  GitHubSearch = (function() {
    GitHubSearch.prototype.server = "https://api.github.com";

    GitHubSearch.prototype.repo = "benbalter/benbalter.github.com";

    GitHubSearch.prototype.language = "markdown";

    GitHubSearch.prototype.results = "#github-search-results";

    function GitHubSearch() {
      this.renderResults = __bind(this.renderResults, this);
      this.success = __bind(this.success, this);
      this.call = __bind(this.call, this);
      var q,
        _this = this;
      $("#github-search-form").submit(function(e) {
        e.preventDefault();
        return _this.getResults($("#github-search-q").val());
      });
      if (location.hash.length) {
        q = location.hash.split('#')[1];
        $("#github-search-q").val(q);
        $("#github-search-form").submit();
      }
    }

    GitHubSearch.prototype.getResults = function(query) {
      this.query = location.hash = query;
      $(this.results).empty();
      return this.call();
    };

    GitHubSearch.prototype.q = function() {
      return "" + this.query + "+repo:" + this.repo + "+language:" + this.language;
    };

    GitHubSearch.prototype.url = function() {
      return "" + this.server + "/search/code?q=" + (this.q());
    };

    GitHubSearch.prototype.call = function() {
      return $.ajax(this.url(), {
        success: this.success,
        headers: {
          accept: "application/vnd.github.v3.text-match+json"
        },
        fail: this.fail
      });
    };

    GitHubSearch.prototype.success = function(data) {
      if (data.total_count === 0) {
        return this.$results.append("<li>No results found</li>");
      } else {
        return this.renderResults(data.items);
      }
    };

    GitHubSearch.prototype.fail = function(data) {
      return console.log(data);
    };

    GitHubSearch.prototype.renderResults = function(results) {
      var _this = this;
      return $.each(results, function(id, result) {
        var formatted;
        formatted = _this.formatResult(result);
        if (formatted != null) {
          return $(_this.results).append(formatted);
        }
      });
    };

    GitHubSearch.prototype.formatResult = function(result) {
      var output, title, url,
        _this = this;
      url = this.resultUrl(result.path);
      title = this.resultTitle(result.path);
      if (!((url != null) && (title != null))) {
        return;
      }
      output = "<li><a href=\"" + url + "\">" + title + "</a>";
      $.each(result.text_matches, function(id, result) {
        var fragment;
        fragment = result.fragment;
        return $.each(result.matches, function(id, match) {
          result = _this.highlight(fragment, match.indices[0], match.indices[1]);
          return output = output + ("<pre>" + result + "</pre>");
        });
      });
      return output = output + "</li>";
    };

    GitHubSearch.prototype.resultUrl = function(path) {
      if (this.getResult(path) != null) {
        return this.getResult(path).url;
      }
    };

    GitHubSearch.prototype.resultTitle = function(path) {
      if (this.getResult(path) != null) {
        return this.getResult(path).title;
      }
    };

    GitHubSearch.prototype.getResult = function(path) {
      return window.github_results_index[path];
    };

    GitHubSearch.prototype.highlight = function(string, start, end) {
      var output;
      output = string.substr(0, start) + "<span class=\"result\">" + string.substr(start);
      return output + string.substr(0, end) + "</span>" + string.substr(end);
    };

    return GitHubSearch;

  })();

  $(function() {
    return new GitHubSearch;
  });

}).call(this);
