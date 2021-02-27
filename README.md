# Violet Server Data Analyzer Server

## Data Model

``` sql
/* 사용자가 '읽기'를 누를 때마다 이 테이블에 정보가 기록됨 */
CREATE TABLE `viewtotal` (
	`Id` INT(11) NOT NULL AUTO_INCREMENT,
	`ArticleId` INT(11) NULL DEFAULT NULL,
	`TimeStamp` TIMESTAMP NULL DEFAULT NULL,
	`UserAppId` CHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`Id`) USING BTREE,
	INDEX `AritcleId` (`ArticleId`) USING BTREE,
	FULLTEXT INDEX `UserAppId` (`UserAppId`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

/* 사용자가 '읽기'를 종료할 때 마다 이 테이블에 정보가 기록됨 */
CREATE TABLE `viewtime` (
	`Id` INT(11) NOT NULL AUTO_INCREMENT,
	`ArticleId` INT(11) NULL DEFAULT NULL,
	`TimeStamp` TIMESTAMP NULL DEFAULT NULL,
	`ViewSeconds` INT(11) NULL DEFAULT NULL,
	`UserAppId` CHAR(50) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`Id`) USING BTREE,
	INDEX `AritcleId` (`ArticleId`) USING BTREE,
	FULLTEXT INDEX `UserAppId` (`UserAppId`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
```

## Queries

### 1. User Statistics

#### 1.1. 총 사용자 수

``` sql
select count(*) as C, UserAppId from viewtotal 
    group by UserAppId 
    order by C desc;
```

#### 1.2. 읽은 횟수 당 사용자 수

``` sql
select C, count(*) as D from 
    (
        select count(*) as C, UserAppId from viewtotal 
        group by UserAppId 
        order by C
    ) as B
    group by C 
    order by D asc;
```

#### 1.3. 작품 당 읽은 횟수

``` sql
select ArticleId, count(*) as C from viewtotal 
    group by ArticleId 
    order by C asc;
```

#### 1.4. 

### 2. Trends

#### 2.1. 