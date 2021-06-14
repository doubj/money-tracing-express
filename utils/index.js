class Utils {
  static resetRequestQuery(query) {
    // 出现异常不会被catch,需要包装成Promise返回?
    // 1. 初始化pageInfo
    const pageInfo = {
      page: 1,
      limit: 300000,
      where: {},
      order: {},
    };
    const compareArray = ["$gte", "$gt", "$lte", "$lt"];
    const pageArray = ["page", "limit"];
    Object.keys(query).forEach((key) => {
      const value = query[key];
      if (key.indexOf("_") !== -1) {
        // key中包含_
        const actualKey = key.split("_")[0];
        const operator = key.split("_")[1];
        if (operator === "like") {
          // 如果是模糊查找
          pageInfo.where[actualKey] = new RegExp(value);
        }
        if (compareArray.indexOf(operator) !== -1) {
          // 1. 判断范围
          if (!pageInfo.where[actualKey]) {
            pageInfo.where[actualKey] = {};
          }
          pageInfo.where[actualKey][operator] = value;
        }
        if (pageArray.indexOf(operator) !== -1) {
          // 分页相关：约定为_page=1,_limit=10
          pageInfo[operator] = +value;
        }
      } else {
        pageInfo.where[key] = value;
      }
    });
    return pageInfo;
  };
}


module.exports = Utils;