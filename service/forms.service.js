const axios = require("axios");
const queryHelper = require("../helper/query");
const querystring = require("querystring");

/**
 * @route GET /api/forms/{formId}/filteredResponses
 * @description get filtered form list from fillout endpoint
 * @param filters
 * @return submission array
 */
const filteredResponses = async (formId, queries) => {
  try {
    if (!formId) {
      return { status: "fail", msg: "FormId is required" };
    }

    // generate query for fillout
    const query = queryHelper.sanitizeQuery(queries);
    const newQuery = querystring.stringify(query);

    // get api key
    const apiKey = process.env.API_KEY;

    // I assumed to get all data without pagination
    const filloutApiUrl = `https://api.fillout.com/v1/api/forms/${formId}/submissions?${newQuery}`;
    const { data } = await axios.get(filloutApiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    let responseData = data;
    if (queries.filters) {
      // filter data
      let filterData = data;
      parsedFilters = JSON.parse(decodeURIComponent(queries.filters));
      filterData = filteredData(data, JSON.parse(queries.filters));

      // apply pagination
      const limit = queries.limit ?? 150;
      const offset = queries.offset ?? 0;
      filterData = applyPagination(filterData, parseInt(offset), parseInt(limit));

      // generate response data
      responseData.responses = filterData;
      responseData.totalResponses = filterData?.length;
      responseData.pageCount = parseInt(offset) + 1;
    }

    return { status: "success", msg: "Success to get data", data: responseData };
  } catch (error) {
    console.log("error###########################", error);
    return null;
  }
};

const filteredData = (data, filters) => {
  return data?.responses.filter((item) => {
    return filters.every((filter) => {
      console.log(item, filter);

      const question = item.questions.find((q) => q.id === filter.id);
      if (!question) {
        return false;
      }
      if (!question.value) {
        return false;
      }
      return evaluateCondition(question.value, filter.value, filter.condition, question.value);
    });
  });

  function evaluateCondition(dataValue, filterValue, condition, valueType) {
    switch (condition) {
      case "equals":
        return valueType === "DatePicker"
          ? new Date(dataValue).getTime() === new Date(filterValue).getTime()
          : valueType === "NumberInput"
          ? parseInt(dataValue) === parseInt(filterValue)
          : dataValue === filterValue;
      case "does_not_equal":
        return valueType != "DatePicker"
          ? new Date(dataValue).getTime() != new Date(filterValue).getTime()
          : valueType === "NumberInput"
          ? parseInt(dataValue) != parseInt(filterValue)
          : dataValue != filterValue;
      case "greater_than":
        return valueType === "DatePicker"
          ? new Date(dataValue).getTime() > new Date(filterValue).getTime()
          : valueType === "NumberInput"
          ? parseInt(dataValue) > parseInt(filterValue)
          : dataValue > filterValue;
      case "less_than":
        return valueType === "DatePicker"
          ? new Date(dataValue).getTime() < new Date(filterValue).getTime()
          : valueType === "NumberInput"
          ? parseInt(dataValue) < parseInt(filterValue)
          : dataValue < filterValue;
      default:
        return false;
    }
  }
};

const applyPagination = (data, offset = 0, limit = 150) => {
  const startIndex = offset * limit;
  const endIndex = startIndex + limit;
  return data.slice(startIndex, endIndex);
};

/** 

  http://localhost:3333/api/forms/cLZojxk94ous?offset=0&filters=%5B%7B%22id%22%3A%224KC356y4M6W8jHPKx9QfEy%22%2C%22condition%22%3A%22equals%22%2C%22value%22%3A%22I%27m%20excited%20for%20it!%22%7D%2C%7B%22id%22%3A%22dSRAe3hygqVwTpPK69p5td%22%2C%22condition%22%3A%22greater_than%22%2C%22value%22%3A%222021-01-23T05%3A01%3A47.691Z%22%7D%5D

  http://localhost:3333/api/forms/cLZojxk94ous?offset=1&filters=%5B%7B%22id%22%3A%22dSRAe3hygqVwTpPK69p5td%22%2C%22condition%22%3A%22greater_than%22%2C%22value%22%3A%222021-01-23T05%3A01%3A47.691Z%22%7D%5D

  {
        "submissionId": "ab9959b2-73e8-4994-85b9-56e780b89ce3",
        "submissionTime": "2024-02-27T19:37:08.228Z",
        "lastUpdatedAt": "2024-02-27T19:37:08.228Z",
        "questions": [
            {
                "id": "4KC356y4M6W8jHPKx9QfEy",
                "name": "Anything else you'd like to share before your call?",
                "type": "LongAnswer",
                "value": "Nothing much to share yet!"
            },
            {
                "id": "bE2Bo4cGUv49cjnqZ4UnkW",
                "name": "What is your name?",
                "type": "ShortAnswer",
                "value": "Johnny"
            },
            {
                "id": "dSRAe3hygqVwTpPK69p5td",
                "name": "Please select a date to schedule your yearly check-in.",
                "type": "DatePicker",
                "value": "2024-02-01"
            },
            {
                "id": "fFnyxwWa3KV6nBdfBDCHEA",
                "name": "How many employees work under you?",
                "type": "NumberInput",
                "value": 2
            },
            {
                "id": "jB2qDRcXQ8Pjo1kg3jre2J",
                "name": "Which department do you work in?",
                "type": "MultipleChoice",
                "value": "Engineering"
            },
            {
                "id": "kc6S6ThWu3cT5PVZkwKUg4",
                "name": "What is your email?",
                "type": "EmailInput",
                "value": "johnny@fillout.com"
            }
        ],
        "calculations": [],
        "urlParameters": [],
        "quiz": {},
        "documents": []
    }

*/

module.exports = {
  filteredResponses,
};
