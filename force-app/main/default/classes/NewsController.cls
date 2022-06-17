public with sharing class NewsController {
    private static Http http = new Http();
    private static HttpRequest request = new HttpRequest();
    private static HttpResponse response = new HttpResponse();
    // private static Map<String, String> mapCountries = new Map<String, String>{
    //     'India' => 'in',
    //     'UK' => 'gb',
    //     'USA' => 'us'
    // };

    public NewsController() {

    }

    @AuraEnabled(cacheable = true)
    public static Map<String, Object> getTopHeadlineNews(String country, String category, String keyword) {
        String jsonResponse = '';
        Map<String, Object> lwcData = new Map<String, Object>();

        String url = String.format('https://newsapi.org/v2/top-headlines?country={0}&category={1}&q={2}', new String[]{ country, category, keyword.toLowerCase() });

        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('X-Api-Key', 'd811b6b197694d20b70dcd981e62fc5a');

        System.Debug('>>>> the value of request is ' + request);

        try {
            response = http.send(request);

            if(response.getStatusCode() == 200){
                jsonResponse = response.getBody();
            } else {
                throw new CalloutException(response.getBody());
            }

            if(String.isBlank(jsonResponse)) {
                return lwcData;
            }

            lwcData = (Map<String, Object>)JSON.deserializeUntyped(jsonResponse);
            return lwcData;

        } catch (Exception e) {
            throw e;
        }
    }
}
