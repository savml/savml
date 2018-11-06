package main

import (
	"github.com/gin-gonic/gin"
	"github.com/savml/savml/packages/savml-registry/savml"
)

func main() {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	c := &savml.Config{
		DbDriverName: "mysql",
		DbDataSourceName :"root:@tcp(127.0.0.1:3306)/savml?charset=utf8",

		DbMaxIdle: 2,
		DbMaxActive: 0,
		DbMaxLifeTime: 0,

		RedisEnabled: true,
		RedisMaxIdle: 300,
		RedisMaxActive: 600,
		RedisIdleTimeout: 0,
		RedisHost: "127.0.0.1",
		RedisPassword: "",


	}
	savml.BindRoute(r, c)
	//r.Static("/", "../static")
	r.Run(":8080")
}
