//动态生成路由
const pageModules =
    import.meta.glob('../pages/**/**.vue'); //vite写法  获取到某个文件夹下的所有的文件

console.log(pageModules);

export default function addRoute(router, arr, parnetName = "home") {
    if (!arr) return;
    arr.forEach((v) => {
        if (v.is_link) {
            router.addRoute(parnetName, {
                path: v.path,
                name: v.name,
                // component: () => import("@/pages/" + v.component + ".vue"),  //webpack里 vue-cli里这样写可以
                component: pageModules['../pages/' + v.component + '.vue'],
                meta: {
                    isDynamic: true, //  是否是动态  一会儿方便删除
                    title: v.title
                }
            });
        }

        if (v.children && v.children.length) {
            addRoute(router, v.children);
        }
    });

    console.log(router.getRoutes());
}