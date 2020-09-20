import { Controller, Post, Body, Get, Param, Put, Delete, UsePipes, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LayerService } from './layer.service';
import { LayerDto, modifyLayerFieldDto } from './dto/layer.dto';

@Controller('layer')
@ApiTags('地图图层模块')
export class LayerController {
    constructor(
        private readonly layerService: LayerService
    ){}

    @Post()
    @ApiOperation({summary: '创建新图层'})
    createLayer(@Body() layerDto: LayerDto){
        return this.layerService.create(layerDto);
    }

    @Get()
    @ApiOperation({summary: '查找所有图层'})
    findAllLayers(){
        return this.layerService.findAllLayers()
    }

    // 修改图层数据-部分字段
    @Put('modify')
    @ApiQuery({
        name: 'layerName',
        description: '请传入待修改图层名字'
    })
    @ApiOperation({summary: '修改图层数据'})
    modifyLayer(@Query('layerName') query, @Body() updateContent:LayerDto){
        return this.layerService.modifyLayer(query, updateContent);
    }

    // 根据图层名称查找图层
    @Get(':layerName')
    @ApiParam({
        name: 'layerName',
        description: '请传入图层名称' 
    })
    @ApiOperation({summary: '根据图层名称查询图层数据'})
    findLayerInfoByName(@Param('layerName') layerName){
        return this.layerService.findLayerInfoByName(layerName);
    }

    // 新增图层字段
    @Post('addLayerField')
    @ApiOperation({
        summary: '新增图层字段'
    })
    addLayerField(@Body() addLayerFieldContent: modifyLayerFieldDto){
        let addLayerFieldObj = {}
        addLayerFieldObj[addLayerFieldContent.modifyFieldName] = addLayerFieldContent.modifyFieldNameCon
        let modifyLayerName = addLayerFieldContent.modifyLayerName;
        return this.layerService.addLayerField(addLayerFieldObj, modifyLayerName)
    }

    // 删除图层字段
    @Post('deleteLayerField')
    @ApiOperation({
        summary: '删除图层字段'
    })
    deleteLayerField(@Body() deleteLayerFieldContent: modifyLayerFieldDto){
        let deleteLayerFieldObj = {}
        deleteLayerFieldObj[deleteLayerFieldContent.modifyFieldName] = deleteLayerFieldContent.modifyFieldNameCon
        let modifyLayerName = deleteLayerFieldContent.modifyLayerName;
        return this.layerService.deleteLayerField(deleteLayerFieldObj, modifyLayerName)
    }   

}
