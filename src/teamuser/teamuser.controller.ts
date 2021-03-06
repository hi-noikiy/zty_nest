import { Controller, Post, Body, Get, Param, Put, Delete, UsePipes, ValidationPipe, UseGuards, Query, Response} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TeamuserService } from './teamuser.service';
import { TeamuserDto, TeamPowerDto, IDListDto } from './dto/teamuser.dto';
import { get } from 'http';

@Controller('teamuser')
@ApiTags('钉图用户模块')
export class TeamuserController {
    constructor(
        private readonly teamuserService: TeamuserService
    ){}

    @Post()
    @ApiOperation({summary: '创建新用户'})
    createTeamUser(@Body() teamuserDto: TeamuserDto){
        return this.teamuserService.create(teamuserDto)
    }

    @Post('joinTeam')
    @ApiQuery({
        name: 'userName',
    })
    @ApiQuery({
        name: 'teamId',
    })
    @ApiOperation({summary: '用户加入团队'})
    joinTeam(@Query('userName') userName,@Query('teamId')  teamId){
        return this.teamuserService.joinTeam(userName,teamId)
    }

    @Post('manageTeam')
    @ApiQuery({
        name: 'userName',
    })
    @ApiQuery({
        name: 'teamId',
    })
    @ApiOperation({summary: '用户加入管理团队'})
    manageTeam(@Query('userName') userName,@Query('teamId')  teamId){
        return this.teamuserService.manageTeam(userName,teamId)
    }

    @Post('createTeam')
    @ApiQuery({
        name: 'userId',
    })
    @ApiQuery({
        name: 'teamName',
    })
    @ApiOperation({summary: '创建新团队'})
    createTeam(@Query('userId') userId, @Query('teamName') teamName){
        return this.teamuserService.createTeam(userId,teamName)
    }

    @Get('getJoinTeamList/:userId')
    @ApiParam({
        name: 'userId',
        description: '请传入用户Id'
    })
    @ApiOperation({summary: '获取用户加入的团队'})
    getJoinTeamList(@Param('userId') userId){
        console.log(userId)
        return this.teamuserService.getJoinTeamList(userId)
    }

    @Get('getManageTeamList/:userId')
    @ApiParam({
        name: 'userId',
        description: '请传入用户Id'
    })
    @ApiOperation({summary: '获取用户管理的团队'})
    getManageTeamList(@Param('userId') userId){
        return this.teamuserService.getManageTeamList(userId)
    }

    @Get('getJoinTeamMapList/:userId')
    @ApiParam({
        name: 'userId',
        description: '请传入用户Id'
    })
    @ApiOperation({summary: '获取用户加入的团队以及地图列表'})
    getJoinTeamMapList(@Param('userId') userId){
        console.log(userId)
        return this.teamuserService.getJoinTeamList(userId)
    }

    @Get('getManageTeamMapList/:userId')
    @ApiParam({
        name: 'userId',
        description: '请传入用户Id'
    })
    @ApiOperation({summary: '获取用户管理的团队以及地图列表'})
    getManageTeamMapList(@Param('userId') userId){
        return this.teamuserService.getManageTeamMapList(userId)
    }

    @Get('getJoinTeamUsersList/:teamId')
    @ApiParam({
        name: 'teamId',
        description: '请传入teamId'
    })
    @ApiOperation({summary: '获取加入团队的用户列表'})
    getJoinTeamUsersList(@Param('teamId') teamId){
        return this.teamuserService.getJoinTeamUsersList(teamId)
    }

    @Get('getManageTeamUsersList/:teamId')
    @ApiParam({
        name: 'teamId',
        description: '请传入teamId'
    })
    @ApiOperation({summary: '获取管理团队的用户列表'})
    getManageTeamUsersList(@Param('teamId') teamId){
        return this.teamuserService.getManageTeamUsersList(teamId)
    }

    @Put('updateUsersTeamPower/:userId')
    @ApiParam({
        name: 'userId',
        description: '请传入userId'
    })
    @ApiOperation({summary: '修改用户对团队的操作权限'})
    updateUsersTeamPower(@Param('userId') userId, @Body() updateContent:TeamPowerDto){
        return this.teamuserService.updateUsersTeamPower(userId,updateContent.teamId,updateContent.power)
    }

    @Put('updateDefaultTeam')
    @ApiQuery({
        name: 'userId',
    })
    @ApiQuery({
        name: 'teamId',
    })
    @ApiOperation({summary: '修改用户默认团队ID'})
    updateDefaultTeam(@Query('userId') userId, @Query('teamId') teamId){
        return this.teamuserService.updateDefaultTeam(userId,teamId)
    }

    @Put('updateTeamDefaultMap')
    @ApiOperation({summary: '修改用户团队的默认地图ID'})
    updateTeamDefaultMap(@Body() IDList: IDListDto){
        return this.teamuserService.updateTeamDefaultMap(IDList.userId,IDList.teamId,IDList.mapId)
    }

    @Delete('removeUserFromTeam')
    @ApiQuery({
        name: 'userId',
    })
    @ApiQuery({
        name: 'teamId',
    })
    @ApiOperation({summary: '把用户移除出团队'})
    async removeUserFromTeam(@Query('userId') userId, @Query('teamId') teamId){
        return await this.teamuserService.removeUserFromTeam(userId,teamId)
    }

    @Delete('removeUserFromManageTeam')
    @ApiQuery({
        name: 'userId',
    })
    @ApiQuery({
        name: 'teamId',
    })
    @ApiOperation({summary: '把用户移除出团队管理员列表'})
    async removeUserFromManageTeam(@Query('userId') userId, @Query('teamId') teamId){
        return await this.teamuserService.removeUserFromManageTeam(userId,teamId)
    }

    // 根据用户Id返回用户信息
    @Get('getUserInfoById/:userId')
    @ApiParam({
        name: 'userId'
    })
    @ApiOperation({summary: '根据用户ID返回用户信息'})
    async getUserInfoById(@Param('userId') userId){
        return await this.teamuserService.getUserInfoById(userId)
    }

    @Post('getUserListByPages')
    @ApiOperation({summary: '分页查询用户列表'})
    async getUserListByPages(@Body() queryBody){
        // let provice = (queryBody.proviceName == "" || !('proviceName' in queryBody) ? {} : {省份:queryBody.proviceName})
        // let type = (queryBody.typeName == "" || !('typeName' in queryBody)? {} : {type:queryBody.typeName})
        let page = ('page' in queryBody)? queryBody.page : 1
        let limit = ('limit' in queryBody)? queryBody.limit : 0
        var queryInfo = {}
        if(!('weixinName' in queryBody) || queryBody.weixinName == ''){
            queryInfo = {
                '$or': [
                    { '$and': [
                        {
                            'role': {$ne: '管理员'}
                        }
                    ]}
                ]
            }
        }
        else{
            let weixinName = queryBody.weixinName
            const reg = new RegExp(weixinName, 'i')
            queryInfo = {
                '$or': [
                    { '$and': [
                        {
                            'weixinName': {$regex: reg}
                        },
                        {
                            'role': {$ne: '管理员'}
                        }
                    ]}
                ]
            }
        }

        let res = await this.teamuserService.getUserListByPages(queryInfo, page, limit)
        return res
    }

    @Post('updateUserinfo/:userId')
    @ApiParam({
        name: 'userId',
        description: '用户Id'
    })
    @ApiOperation({summary: '更新用户信息'})
    async updateUserinfo(@Param('userId') userId, @Body() userinfo){
        return await this.teamuserService.updateUserInfo(userId,userinfo)
    }

    @Delete('deleteUserinfo/:userId')
    @ApiParam({
        name: 'userId',
        description: '用户Id'
    })
    @ApiOperation({summary: '删除用户信息'})
    async deleteUserinfo(@Param('userId') userId){
        return await this.teamuserService.deleteUser(userId)
    }

    @Post('updatePassword/:userId')
    @ApiParam({
        name: 'userId',
        description: '用户Id'
    })
    @ApiOperation({summary: '修改用户密码'})
    async updatePassword(@Param('userId') userId, @Body() passwordList){
        console.log(passwordList)
        return await this.teamuserService.updatePassword(userId,passwordList.oldPassword,passwordList.newPassword)
    }

    @Get('getPower')
    @ApiQuery({
        name: 'userId',
        description: "用户Id"
    })
    @ApiQuery({
        name: 'teamId',
        description: "团队Id"
    })
    @ApiOperation({summary: '获取用户权限'})
    async getUserPower(@Query('userId') userId, @Query('teamId') teamId){
        return await this.teamuserService.getUserPower(userId,teamId)
    }

        //用户添加关注的项目信息
        @Get('addCareProject')
        @ApiQuery({
            name:'userId'
        })
        @ApiQuery({
            name:'projectName'
        })
        @ApiOperation({summary: '用户增加关注的项目信息'})
        addCareProject(@Query('userId') userId, @Query('projectName') projectName){
            return this.teamuserService.addCareProject(userId, projectName)
        }
    
    //用户删除关注的项目信息
    @Get('deleteCareProject')
    @ApiQuery({
        name:'userId'
    })
    @ApiQuery({
        name:'projectName'
    })
    @ApiOperation({summary: '用户删除关注的项目信息'})
    deleteCareProject(@Query('userId') userId, @Query('projectName') projectName){
        return this.teamuserService.deleteCareProject(userId, projectName)
    }
    
    //返回用户关注列表信息
    @Post('getCareProjectList')
    @ApiQuery({
        name:'userId'
    })
    @ApiOperation({summary:'返回用户关注列表信息'})
    getCareProjectList(@Query('userId') userId){
        return this.teamuserService.getCareProjectList(userId)
    }

    //检查是否有更新信息
    @Post('checkNewInfo')
    @ApiQuery({
        name: 'userId'
    })
    @ApiOperation({summary: '检查是否有更新消息'})
    checkNewInfo(@Query('userId') userId){
        return this.teamuserService.checkNewInfo(userId)
    }

    //搜索项目记录
    @Post('projectAllInfo')
    @ApiQuery({
        name:'projectName'
    })
    @ApiOperation({summary:'搜索项目所有记录'})
    getAllInfo(@Query('projectName') projectName){
        return this.teamuserService.getAllInfo(projectName)
    }


    //更新时间戳
    @Get('updateLatestDate')
    @ApiQuery({
        name:'projectName'
    })
    @ApiQuery({
        name:'userId'
    })
    @ApiOperation({summary:'更新关注项目的时间戳'})
    updateLatestDate(@Query('userId') userId, @Query('projectName') projectName){
        return this.teamuserService.updateLatestDate(userId, projectName)
    }

    //公路信息爬虫
    @Get('getGlxyInfo/:companyName')
    @ApiParam({
        name:'companyName'
    })
    @ApiOperation({summary:'获取公路局数据'})
    async getGlxyInfo(@Param('companyName') companyName){
        console.log('数据获取中！')
        return await this.teamuserService.getGlxyInfo(companyName)
    }
    //发送公路信息表格
    @Get('sendGlxyInfo/:companyName')
    @ApiParam({
        name:'companyName'
    })
    @ApiOperation({summary:'发送公路局数据'})
    async sendGlxyInfo(@Param('companyName') companyName, @Response() res){
        console.log('文件导出成功！')
        res.setHeader('Content-Type', 'application/octet-stream')
        res.send(await this.teamuserService.sendGlxyInfo(companyName))
    }
    //检测是否已存在表格
    @Get('IsGlxyInfo/:companyName')
    @ApiParam({
        name:'companyName'
    })
    @ApiOperation({summary:'检测公路数据是否已存在'})
    async IsGlxyInfo(@Param('companyName') companyName){
        return await this.teamuserService.IsGlxyInfo(companyName)
    }


    //公路信息分sheet获取
    @Get('getGlxyDetails/:companyName')
    @ApiParam({
        name:'companyName'
    })
    @ApiOperation({summary:'获取公路局数据分sheet详细'})
    async getGlxyInfo_sheets(@Param('companyName') companyName){
        console.log('正在获取数据！')
        return await this.teamuserService.getGlxyInfo_sheets(companyName)
    }
    //公路信息分sheet发送
    @Get('sendGlxyDetails/:companyName')
    @ApiParam({
        name:'companyName' 
    })
    @ApiOperation({summary:'发送公路局数据分sheet详细'})
    async sendGlxyInfo_sheets(@Param('companyName') companyName, @Response() res){
        console.log('文件导出成功！')
        res.setHeader('Content-Type', 'application/octet-stream')
        res.send(await this.teamuserService.sendGlxyInfo_sheets(companyName))
    }
    //检测是否已存在表格
    @Get('IsGlxyInfoDetails/:companyName')
    @ApiParam({
        name:'companyName'
    })
    @ApiOperation({summary:'检测公路信息分sheet是否已存在'})
    async IsGlxyInfo_sheets(@Param('companyName') companyName){
        return await this.teamuserService.IsGlxyInfo_sheets(companyName)
    }
}
