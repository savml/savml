package savml

import (
	"database/sql"
	"github.com/gomodule/redigo/redis"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"time"
	"github.com/go-gomail/gomail"
	"github.com/pkg/errors"
)

type Context struct {
	Db *sql.DB
	Redis *redis.Pool
	UseRedis bool
	UseEmail bool
	Mail *gomail.Dialer
	MailFrom string
}

func (ctx * Context) SendEmail(mailTo string, subject string, body string) error {
	if !ctx.UseEmail {
		return  errors.New("mail disabled")
	}
	m := gomail.NewMessage()
	m.SetHeader("To", mailTo)
	m.SetHeader("From", ctx.MailFrom)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)
	return ctx.Mail.DialAndSend(m)
}

type Handler func(c * gin.Context, s *Context)


func makeHandler(s * Context, handler Handler) func(g * gin.Context) {
	return func(g * gin.Context) {
		g.Request.ParseForm()
		handler(g, s)
	}
}

type Config struct {
	DbDriverName string // "mysql"
	DbDataSourceName string // root:11111111@tcp(127.0.0.1:3306)/mytest?charset=utf8
	// 最大空闲连接数
	DbMaxIdle int
	// 一个pool所能分配的最大的连接数目
	// 当设置成0的时候，该pool连接数没有限制
	DbMaxActive int
	// 空闲连接超时时间，超过超时时间的空闲连接会被关闭。
	// 如果设置成0，空闲连接将不会被关闭
	DbMaxLifeTime time.Duration

	// 是否开启Redis
	RedisEnabled bool
	// 最大空闲连接数
	RedisMaxIdle int
	// 一个pool所能分配的最大的连接数目
	// 当设置成0的时候，该pool连接数没有限制
	RedisMaxActive int
	// 空闲连接超时时间，超过超时时间的空闲连接会被关闭。
	// 如果设置成0，空闲连接将不会被关闭
	// 应该设置一个比redis服务端超时时间更短的时间
	RedisIdleTimeout time.Duration
	RedisHost string
	RedisPassword string

	// 是否开启Email
	MailEnabled bool
	MailHost string
	MailPort int
	MailUserName string
	MailPassword string
	MailFrom string
}

func BindRoute(gin *gin.Engine, config * Config)  {
	s := &Context{}
	conn, err := sql.Open(config.DbDriverName, config.DbDataSourceName)
	if err != nil {
		panic(err)
	}
	conn.SetMaxIdleConns(config.DbMaxIdle)
	conn.SetMaxOpenConns(config.DbMaxActive)
	conn.SetConnMaxLifetime(config.DbMaxLifeTime)
	s.Db = conn
	defer conn.Close()
	if config.RedisEnabled  {
		s.UseRedis = true
		s.Redis = &redis.Pool{
			MaxIdle:     config.RedisMaxIdle,
			MaxActive:   config.RedisMaxActive,
			IdleTimeout: config.RedisIdleTimeout,
			Dial: func() (redis.Conn, error) {
				c, err := redis.Dial("tcp", config.RedisHost)
				if err != nil {
					return nil, err
				}
				if config.RedisPassword != "" {
					if _, err := c.Do("AUTH", config.RedisPassword); err != nil {
						c.Close()
						return nil, err
					}
				}
				return c, err
			},
			TestOnBorrow: func(c redis.Conn, t time.Time) error {
				_, err := c.Do("PING")
				return err
			},
		}
	}

	s.MailFrom = config.MailFrom
	if config.MailEnabled {
		s.UseEmail = true
		s.Mail = gomail.NewDialer(config.MailHost, config.MailPort, config.MailUserName, config.MailPassword)
	}

	gin.POST("/login", makeHandler(s, Login))
	gin.POST("/register", makeHandler(s, Register))

	gin.POST("/team/create", makeHandler(s, CreateTeam))
	gin.GET("/team/packages", makeHandler(s, GetTeamPackages))
	gin.GET("/teams", makeHandler(s, GetTeams))

	gin.GET("/info/:package", makeHandler(s, GetPackageInfo))
	gin.GET("/search", makeHandler(s, SearchPackage))
	gin.GET("/fetch/:package/:version", makeHandler(s, FetchPackage))
	gin.GET("/detail/:package/:version", makeHandler(s, FetchPackage))
	gin.POST("/publish/:package/:version", makeHandler(s, PublishPackage))
	gin.POST("/delete/:package/:version", makeHandler(s, DeletePackage))

}
