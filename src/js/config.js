(function() {
  "use strict";

  exports.apiKey = process.env.GOOGLE_PLACES_API_KEY || "AIzaSyBeDnT9G9IMIFxH9jjTUxmzSKwfForVk04";
  exports.outputFormat = process.env.GOOGLE_PLACES_OUTPUT_FORMAT || "json";
})();
